from decimal import Decimal
from django.db import models
from django.conf import settings

class InvestmentPool(models.Model):
    name = models.CharField(max_length=100, default="XF Master Fund")
    current_nav = models.DecimalField(max_digits=14, decimal_places=4, default=Decimal('1.0000'))
    total_units = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal('0.0000'))
    total_equity_usd = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    high_water_mark = models.DecimalField(max_digits=18, decimal_places=2, default=Decimal('0.00'))
    total_investors_count = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} | NAV: ${self.current_nav} | Total Units: {self.total_units} | Equity: ${self.total_equity_usd}"

    @classmethod
    def get_pool(cls):
        pool, _ = cls.objects.get_or_create(id=1, defaults={
            'name': 'XF Master Fund',
            'current_nav': Decimal('1.0000'),
            'total_units': Decimal('0.0000'),
            'total_equity_usd': Decimal('0.00'),
            'high_water_mark': Decimal('0.00')
        })
        return pool

class InvestorPosition(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investment_position')
    units = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal('0.0000'))
    total_deposited_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    total_withdrawn_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    total_profit_earned_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    referral_earnings_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def current_value_usd(self):
        pool = InvestmentPool.get_pool()
        return round(self.units * pool.current_nav, 2)

    def __str__(self):
        return f"{self.user.full_name} | {self.units} Units (~${self.current_value_usd})"

class TradeSession(models.Model):
    TRADER_TYPE_CHOICES = (
        ('XF', 'Xorazm Forex (50% XF / 50% Investor)'),
        ('EXTERNAL', 'External Trader (25% XF / 25% Trader / 50% Investor)'),
    )

    session_id = models.CharField(max_length=50, unique=True, db_index=True)
    trader_type = models.CharField(max_length=20, choices=TRADER_TYPE_CHOICES, default='XF')
    trader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='conducted_sessions')
    
    gross_profit_usd = models.DecimalField(max_digits=14, decimal_places=2) # e.g. +70.00 or -20.00
    xf_share_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    trader_share_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    investors_share_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))

    nav_before = models.DecimalField(max_digits=14, decimal_places=4)
    nav_after = models.DecimalField(max_digits=14, decimal_places=4)
    total_units_snapshot = models.DecimalField(max_digits=18, decimal_places=4)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id}: Gross ${self.gross_profit_usd} (Investors: ${self.investors_share_usd})"

class SessionDistribution(models.Model):
    session = models.ForeignKey(TradeSession, on_delete=models.CASCADE, related_name='distributions')
    investor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='session_distributions')
    units_at_session = models.DecimalField(max_digits=18, decimal_places=4)
    gross_share_usd = models.DecimalField(max_digits=14, decimal_places=2)
    referral_deducted_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    net_share_usd = models.DecimalField(max_digits=14, decimal_places=2)
    referrer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='referral_distributions')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.investor.full_name}: Net +${self.net_share_usd} (Ref: ${self.referral_deducted_usd})"

class NAVHistory(models.Model):
    EVENT_CHOICES = (
        ('INITIAL', 'Initial Fund Creation'),
        ('DEPOSIT', 'Deposit Credited'),
        ('WITHDRAWAL', 'Withdrawal Processed'),
        ('SESSION_PROFIT', 'Session Profit Distributed'),
        ('SESSION_LOSS', 'Session Loss Distributed'),
    )

    nav = models.DecimalField(max_digits=14, decimal_places=4)
    total_units = models.DecimalField(max_digits=18, decimal_places=4)
    total_equity_usd = models.DecimalField(max_digits=18, decimal_places=2)
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES)
    note = models.CharField(max_length=255, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']

    def __str__(self):
        return f"[{self.recorded_at.strftime('%Y-%m-%d %H:%M')}] NAV: ${self.nav} ({self.event_type})"
