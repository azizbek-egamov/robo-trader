from django.urls import path
from .views import (
    ActiveP2PCardView, AdminP2PCardSettingView,
    CreateDepositRequestView, MyDepositsListView,
    AdminDepositListView, AdminApproveDepositView, AdminRejectDepositView,
    CreateWithdrawalRequestView, MyWithdrawalsListView,
    AdminWithdrawalListView, AdminProcessWithdrawalView,
    MyLedgerListView
)

urlpatterns = [
    path('card-details/', ActiveP2PCardView.as_view(), name='active_card_details'),
    path('admin/card-details/', AdminP2PCardSettingView.as_view(), name='admin_card_settings'),
    
    path('deposit/create/', CreateDepositRequestView.as_view(), name='create_deposit'),
    path('deposit/my/', MyDepositsListView.as_view(), name='my_deposits'),
    path('admin/deposits/', AdminDepositListView.as_view(), name='admin_deposits'),
    path('admin/deposits/<int:pk>/approve/', AdminApproveDepositView.as_view(), name='admin_approve_deposit'),
    path('admin/deposits/<int:pk>/reject/', AdminRejectDepositView.as_view(), name='admin_reject_deposit'),

    path('withdraw/create/', CreateWithdrawalRequestView.as_view(), name='create_withdrawal'),
    path('withdraw/my/', MyWithdrawalsListView.as_view(), name='my_withdrawals'),
    path('admin/withdrawals/', AdminWithdrawalListView.as_view(), name='admin_withdrawals'),
    path('admin/withdrawals/<int:pk>/process/', AdminProcessWithdrawalView.as_view(), name='admin_process_withdrawal'),

    path('ledger/my/', MyLedgerListView.as_view(), name='my_ledger'),
]

