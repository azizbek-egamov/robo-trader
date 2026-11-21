import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import P2PCardSetting, DepositRequest, WithdrawalRequest, TransactionLedger
from .serializers import (
    P2PCardSettingSerializer, DepositRequestSerializer,
    WithdrawalRequestSerializer, TransactionLedgerSerializer
)
from investments.models import InvestmentPool, InvestorPosition
from investments.services import InvestmentService
from notifications.utils import broadcast_to_admins

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_staff))

class ActiveP2PCardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        card = P2PCardSetting.objects.filter(is_active=True).first()
        if not card:
            # Default karta yaratish
            card = P2PCardSetting.objects.create(
                card_number="8600 0000 0000 0000",
                card_holder="XORAZM FOREX LLC",
                bank_name="Agrobank / Uzcard",
                exchange_rate_usd_uzs=Decimal('12800.00'),
                is_active=True
            )
        return Response(P2PCardSettingSerializer(card).data)

class AdminP2PCardSettingView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request):
        card = P2PCardSetting.objects.filter(is_active=True).first()
        serializer = P2PCardSettingSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateDepositRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount_usd = request.data.get('amount_usd')
        amount_uzs = request.data.get('amount_uzs')
        card_used = request.data.get('card_used', '')
        receipt_image = request.FILES.get('receipt_image')

        if not amount_usd or not amount_uzs:
            return Response({'error': 'amount_usd va amount_uzs kiritilishi shart.'}, status=status.HTTP_400_BAD_REQUEST)

        deposit_id = f"DEP-{uuid.uuid4().hex[:8].upper()}"
        deposit = DepositRequest.objects.create(
            deposit_id=deposit_id,
            user=request.user,
            amount_usd=Decimal(str(amount_usd)),
            amount_uzs=Decimal(str(amount_uzs)),
            card_used=card_used,
            receipt_image=receipt_image,
            status='PENDING'
        )

        # Adminga tezkor bildirishnoma
        broadcast_to_admins('new_deposit_request', {
            'deposit_id': deposit_id,
            'user': request.user.full_name,
            'amount_usd': str(amount_usd),
            'amount_uzs': str(amount_uzs),
            'message': f"Yangi P2P depozit cheki keldi: {request.user.full_name} (${amount_usd})"
        })

        return Response(DepositRequestSerializer(deposit).data, status=status.HTTP_201_CREATED)

class MyDepositsListView(generics.ListAPIView):
    serializer_class = DepositRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DepositRequest.objects.filter(user=self.request.user)

class AdminDepositListView(generics.ListAPIView):
    serializer_class = DepositRequestSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        qs = DepositRequest.objects.all()
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

class AdminApproveDepositView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        try:
            deposit = InvestmentService.credit_deposit(deposit_id=pk, admin_user=request.user)
            return Response(DepositRequestSerializer(deposit).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminRejectDepositView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        notes = request.data.get('notes', 'Chek tasdiqlanmadi')
        try:
            deposit = DepositRequest.objects.get(id=pk)
            deposit.status = 'REJECTED'
            deposit.admin_notes = notes
            deposit.resolved_at = timezone.now()
            deposit.save()
            return Response(DepositRequestSerializer(deposit).data)
        except DepositRequest.DoesNotExist:
            return Response({'error': 'Depozit topilmadi.'}, status=status.HTTP_404_NOT_FOUND)

class CreateWithdrawalRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount_usd = request.data.get('amount_usd')
        target_card_number = request.data.get('target_card_number')
        target_card_holder = request.data.get('target_card_holder')

        if not amount_usd or not target_card_number or not target_card_holder:
            return Response({'error': 'Barcha maydonlar to‘ldirilishi shart.'}, status=status.HTTP_400_BAD_REQUEST)

        amount_usd_dec = Decimal(str(amount_usd))
        pool = InvestmentPool.get_pool()
        position = InvestmentService.get_or_create_position(request.user)

        if position.current_value_usd < amount_usd_dec:
            return Response({
                'error': f"Mablag‘ yetarli emas. Joriy balansingiz: ${position.current_value_usd}"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Kerakli units miqdorini hisoblash
        units_to_redeem = round(amount_usd_dec / pool.current_nav, 4)
        active_card = P2PCardSetting.objects.filter(is_active=True).first()
        rate = active_card.exchange_rate_usd_uzs if active_card else Decimal('12800.00')
        amount_uzs = round(amount_usd_dec * rate, 2)

        withdrawal_id = f"WTH-{uuid.uuid4().hex[:8].upper()}"
        withdrawal = WithdrawalRequest.objects.create(
            withdrawal_id=withdrawal_id,
            user=request.user,
            amount_usd=amount_usd_dec,
            amount_uzs=amount_uzs,
            units_to_redeem=units_to_redeem,
            target_card_number=target_card_number,
            target_card_holder=target_card_holder,
            status='PENDING'
        )

        broadcast_to_admins('new_withdrawal_request', {
            'withdrawal_id': withdrawal_id,
            'user': request.user.full_name,
            'amount_usd': str(amount_usd_dec),
            'target_card': target_card_number,
            'message': f"Pul yechish so‘rovi: {request.user.full_name} (${amount_usd_dec})"
        })

        return Response(WithdrawalRequestSerializer(withdrawal).data, status=status.HTTP_201_CREATED)

class MyWithdrawalsListView(generics.ListAPIView):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WithdrawalRequest.objects.filter(user=self.request.user)

class AdminWithdrawalListView(generics.ListAPIView):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        qs = WithdrawalRequest.objects.all()
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

class AdminProcessWithdrawalView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        action = request.data.get('action') # 'approve' or 'reject'
        notes = request.data.get('notes', '')

        try:
            withdrawal = InvestmentService.process_withdrawal_approval(
                withdrawal_id=pk,
                admin_user=request.user,
                approved=(action == 'approve'),
                admin_notes=notes
            )
            return Response(WithdrawalRequestSerializer(withdrawal).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyLedgerListView(generics.ListAPIView):
    serializer_class = TransactionLedgerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TransactionLedger.objects.filter(user=self.request.user)[:100]
