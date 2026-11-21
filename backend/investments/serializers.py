from rest_framework import serializers
from .models import InvestmentPool, InvestorPosition, TradeSession, SessionDistribution, NAVHistory
from users.serializers import UserProfileSerializer

class InvestmentPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentPool
        fields = [
            'id', 'name', 'current_nav', 'total_units', 'total_equity_usd',
            'high_water_mark', 'total_investors_count', 'updated_at'
        ]

class InvestorPositionSerializer(serializers.ModelSerializer):
    current_value_usd = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = InvestorPosition
        fields = [
            'id', 'user', 'units', 'current_value_usd', 'total_deposited_usd',
            'total_withdrawn_usd', 'total_profit_earned_usd', 'referral_earnings_usd',
            'updated_at'
        ]

class SessionDistributionSerializer(serializers.ModelSerializer):
    investor_name = serializers.CharField(source='investor.full_name', read_only=True)
    referrer_name = serializers.CharField(source='referrer.full_name', read_only=True, default=None)

    class Meta:
        model = SessionDistribution
        fields = [
            'id', 'session', 'investor_name', 'units_at_session',
            'gross_share_usd', 'referral_deducted_usd', 'net_share_usd',
            'referrer_name', 'created_at'
        ]

class TradeSessionSerializer(serializers.ModelSerializer):
    distributions = SessionDistributionSerializer(many=True, read_only=True)
    trader_name = serializers.CharField(source='trader.full_name', read_only=True, default=None)

    class Meta:
        model = TradeSession
        fields = [
            'id', 'session_id', 'trader_type', 'trader_name',
            'gross_profit_usd', 'xf_share_usd', 'trader_share_usd', 'investors_share_usd',
            'nav_before', 'nav_after', 'total_units_snapshot', 'notes', 'created_at',
            'distributions'
        ]

class NAVHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NAVHistory
        fields = ['id', 'nav', 'total_units', 'total_equity_usd', 'event_type', 'note', 'recorded_at']

