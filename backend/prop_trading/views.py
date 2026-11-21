import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import PropExam
from .serializers import PropExamSerializer
from billing.models import TransactionLedger
from notifications.utils import broadcast_to_user, broadcast_to_admins, broadcast_public_event

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_staff))

class ApplyPropExamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        card_info = request.data.get('card_info_used', '')
        receipt_image = request.FILES.get('receipt_image')

        exam_id = f"PROP-{uuid.uuid4().hex[:8].upper()}"
        exam = PropExam.objects.create(
            exam_id=exam_id,
            user=request.user,
            fee_uzs=Decimal('100000.00'),
            card_info_used=card_info,
            receipt_image=receipt_image,
            status='PENDING_PAYMENT_APPROVAL'
        )

        TransactionLedger.objects.create(
            user=request.user,
            tx_type='PROP_EXAM_FEE',
            amount_uzs=Decimal('100000.00'),
            description=f"Prop-trading imtihon to‘lovi topshirildi (#{exam_id})"
        )

        broadcast_to_admins('new_prop_exam_application', {
            'exam_id': exam_id,
            'user': request.user.full_name,
            'fee_uzs': '100,000',
            'message': f"Yangi Prop Imtihon arizasi: {request.user.full_name} (100 000 so‘m to‘landi)"
        })

        return Response(PropExamSerializer(exam).data, status=status.HTTP_201_CREATED)

class MyPropExamsListView(generics.ListAPIView):
    serializer_class = PropExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PropExam.objects.filter(user=self.request.user)

class AdminPropExamsListView(generics.ListAPIView):
    serializer_class = PropExamSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        qs = PropExam.objects.all()
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

class AdminApprovePropExamView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        mt5_login = request.data.get('mt5_login')
        mt5_password = request.data.get('mt5_password')
        mt5_server = request.data.get('mt5_server', 'Alpari-MT5-Demo')
        demo_balance = request.data.get('demo_balance_usd', 10000.00)

        if not mt5_login or not mt5_password:
            return Response({'error': 'MT5 login va parol kiritilishi shart.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = PropExam.objects.get(id=pk)
            exam.mt5_login = mt5_login
            exam.mt5_password = mt5_password
            exam.mt5_server = mt5_server
            exam.demo_balance_usd = Decimal(str(demo_balance))
            exam.status = 'ACTIVE'
            exam.activated_at = timezone.now()
            exam.save()

            # Foydalanuvchiga XP berish (+100 XP)
            exam.user.xp_points += 100
            exam.user.save(update_fields=['xp_points'])

            broadcast_to_user(exam.user.id, 'prop_exam_credentials', {
                'exam_id': exam.exam_id,
                'mt5_login': mt5_login,
                'mt5_password': mt5_password,
                'mt5_server': mt5_server,
                'demo_balance': str(exam.demo_balance_usd),
                'message': f"100 000 so‘mlik to‘lovingiz tasdiqlandi! MT5 Demo hisob ma'lumotlaringiz: Login: {mt5_login}, Parol: {mt5_password}, Server: {mt5_server}"
            })

            broadcast_public_event('new_activity_ticker', {
                'name': exam.user.full_name.split()[0] if exam.user.full_name else "Treyder",
                'action': f"100 000 so‘mlik Prop Imtihon hisobini oldi va savdoni boshladi",
                'type': 'PROP'
            })

            return Response(PropExamSerializer(exam).data)
        except PropExam.DoesNotExist:
            return Response({'error': 'Imtihon topilmadi.'}, status=status.HTTP_404_NOT_FOUND)

class AdminUpdatePropStatusView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        new_status = request.data.get('status') # 'PASSED', 'FAILED', 'REJECTED'
        notes = request.data.get('notes', '')

        if new_status not in ['PASSED', 'FAILED', 'REJECTED']:
            return Response({'error': 'Noto‘g‘ri status.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = PropExam.objects.get(id=pk)
            exam.status = new_status
            exam.admin_notes = notes
            exam.completed_at = timezone.now()
            exam.save()

            if new_status == 'PASSED':
                exam.user.xp_points += 300
                exam.user.save(update_fields=['xp_points'])
                broadcast_public_event('new_activity_ticker', {
                    'name': exam.user.full_name.split()[0],
                    'action': f"Prop Imtihonidan muvaffaqiyatli o‘tdi va kapital boshqaruvchisi bo‘ldi!",
                    'type': 'PASSED'
                })

            broadcast_to_user(exam.user.id, 'prop_status_updated', {
                'exam_id': exam.exam_id,
                'status': new_status,
                'notes': notes
            })

            return Response(PropExamSerializer(exam).data)
        except PropExam.DoesNotExist:
            return Response({'error': 'Imtihon topilmadi.'}, status=status.HTTP_404_NOT_FOUND)
