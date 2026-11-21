from rest_framework import serializers
from .models import P2PCardSetting, DepositRequest, WithdrawalRequest, TransactionLedger

class P2PCardSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = P2PCardSetting
        fields = ['id', 'card_number', 'card_holder', 'bank_name', 'exchange_rate_usd_uzs', 'is_active', 'updated_at']

class DepositRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = DepositRequest
        fields = [
            'id', 'deposit_id', 'user_name', 'user_phone', 'amount_uzs',
            'amount_usd', 'units_credited', 'card_used', 'receipt_image',
            'status', 'admin_notes', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'deposit_id', 'units_credited', 'status', 'created_at', 'resolved_at']

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'withdrawal_id', 'user_name', 'user_phone', 'amount_usd',
            'amount_uzs', 'units_to_redeem', 'target_card_number', 'target_card_holder',
            'status', 'admin_notes', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'withdrawal_id', 'units_to_redeem', 'status', 'created_at', 'resolved_at']

class TransactionLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionLedger
        fields = [
            'id', 'tx_type', 'amount_usd', 'amount_uzs', 'units_delta',
            'balance_after_usd', 'description', 'created_at'
        ]

