from rest_framework import serializers
from .models import PropExam

class PropExamSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = PropExam
        fields = [
            'id', 'exam_id', 'user_name', 'user_phone', 'fee_uzs',
            'card_info_used', 'receipt_image', 'status',
            'mt5_login', 'mt5_password', 'mt5_server', 'demo_balance_usd',
            'target_profit_percent', 'max_loss_percent', 'daily_loss_percent',
            'admin_notes', 'created_at', 'activated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'exam_id', 'created_at', 'activated_at', 'completed_at']

