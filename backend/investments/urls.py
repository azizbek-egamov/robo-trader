from django.urls import path
from .views import (
    PoolStatsView, NAVHistoryListView, TradeSessionListView,
    MyPositionView, ExecuteTradeSessionView, AdminInvestorsListView
)

urlpatterns = [
    path('pool/', PoolStatsView.as_view(), name='pool_stats'),
    path('nav-history/', NAVHistoryListView.as_view(), name='nav_history'),
    path('sessions/', TradeSessionListView.as_view(), name='trade_sessions'),
    path('my-position/', MyPositionView.as_view(), name='my_position'),
    path('admin/execute-session/', ExecuteTradeSessionView.as_view(), name='execute_session'),
    path('admin/investors/', AdminInvestorsListView.as_view(), name='admin_investors'),
]

