from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import InvestmentPool, InvestorPosition, TradeSession, NAVHistory
from .serializers import (
    InvestmentPoolSerializer, InvestorPositionSerializer,
    TradeSessionSerializer, NAVHistorySerializer
)
from .services import InvestmentService

User = get_user_model()

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_staff))

class PoolStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        pool = InvestmentPool.get_pool()
        pool.total_investors_count = InvestorPosition.objects.filter(units__gt=0).count()
        pool.save(update_fields=['total_investors_count'])
        return Response(InvestmentPoolSerializer(pool).data)

class NAVHistoryListView(generics.ListAPIView):
    queryset = NAVHistory.objects.all()[:100]
    serializer_class = NAVHistorySerializer
    permission_classes = [permissions.AllowAny]

class TradeSessionListView(generics.ListAPIView):
    queryset = TradeSession.objects.all().order_by('-created_at')[:50]
    serializer_class = TradeSessionSerializer
    permission_classes = [permissions.AllowAny]

class MyPositionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        position = InvestmentService.get_or_create_position(request.user)
        return Response(InvestorPositionSerializer(position).data)

class ExecuteTradeSessionView(APIView):
    permission_classes = [IsAdminUserRole]

    def post(self, request):
        """Admin tomonidan: '70$ foyda yopdim' deb kiritish"""
        gross_profit = request.data.get('gross_profit_usd')
        trader_type = request.data.get('trader_type', 'XF')
        notes = request.data.get('notes', '')
        trader_id = request.data.get('trader_id')

        if gross_profit is None:
            return Response({'error': 'gross_profit_usd maydoni kiritilishi shart.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            gross_profit_decimal = Decimal(str(gross_profit))
        except Exception:
            return Response({'error': 'Foyda summasi noto‘g‘ri formatda.'}, status=status.HTTP_400_BAD_REQUEST)

        trader_user = None
        if trader_id:
            try:
                trader_user = User.objects.get(id=trader_id)
            except User.DoesNotExist:
                return Response({'error': 'Ko‘rsatilgan treyder topilmadi.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            session = InvestmentService.execute_trade_session(
                gross_profit_usd=gross_profit_decimal,
                trader_type=trader_type,
                trader_user=trader_user,
                notes=notes,
                admin_user=request.user
            )
            return Response(TradeSessionSerializer(session).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f"Tizim xatoligi: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminInvestorsListView(generics.ListAPIView):
    queryset = InvestorPosition.objects.filter(units__gt=0).select_related('user').order_by('-units')
    serializer_class = InvestorPositionSerializer
    permission_classes = [IsAdminUserRole]
