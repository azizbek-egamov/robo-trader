from rest_framework import serializers
from django.contrib.auth import get_user_model
from investments.models import InvestorPosition, InvestmentPool

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    referral_code = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'phone', 'full_name', 'password', 'referral_code']

    def validate_phone(self, value):
        import re
        clean = re.sub(r'[^\d+]', '', value)
        if not clean.startswith('+'):
            clean = '+' + clean
        if len(clean) != 13 or not clean.startswith('+998'):
            raise serializers.ValidationError("Telefon raqami +998 bilan boshlanishi va 12 ta raqamdan iborat bo‘lishi kerak.")
        return clean

    def create(self, validated_data):
        ref_code = validated_data.pop('referral_code', None)
        password = validated_data.pop('password')
        
        referred_by = None
        if ref_code:
            try:
                referred_by = User.objects.get(referral_code__iexact=ref_code.strip())
            except User.DoesNotExist:
                pass

        user = User.objects.create_user(
            password=password,
            referred_by=referred_by,
            **validated_data
        )

        # InvestorPosition yaratish
        InvestorPosition.objects.get_or_create(user=user)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    referred_by_name = serializers.CharField(source='referred_by.full_name', read_only=True)
    units = serializers.SerializerMethodField()
    current_value_usd = serializers.SerializerMethodField()
    total_deposited_usd = serializers.SerializerMethodField()
    total_withdrawn_usd = serializers.SerializerMethodField()
    total_profit_earned_usd = serializers.SerializerMethodField()
    referral_earnings_usd = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'phone', 'full_name', 'role', 'referral_code', 'referred_by_name',
            'xp_points', 'telegram_id', 'created_at',
            'units', 'current_value_usd', 'total_deposited_usd',
            'total_withdrawn_usd', 'total_profit_earned_usd', 'referral_earnings_usd'
        ]

    def get_units(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.units) if pos else "0.0000"

    def get_current_value_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.current_value_usd) if pos else "0.00"

    def get_total_deposited_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.total_deposited_usd) if pos else "0.00"

    def get_total_withdrawn_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.total_withdrawn_usd) if pos else "0.00"

    def get_total_profit_earned_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.total_profit_earned_usd) if pos else "0.00"

    def get_referral_earnings_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.referral_earnings_usd) if pos else "0.00"

class LeaderboardUserSerializer(serializers.ModelSerializer):
    current_value_usd = serializers.SerializerMethodField()
    units = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'xp_points', 'role', 'current_value_usd', 'units']

    def get_current_value_usd(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.current_value_usd) if pos else "0.00"

    def get_units(self, obj):
        pos = getattr(obj, 'investment_position', None)
        return str(pos.units) if pos else "0.0000"

