from decimal import Decimal
from django.db import models
from django.conf import settings

class P2PCardSetting(models.Model):
    card_number = models.CharField(max_length=30)
    card_holder = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100)
    exchange_rate_usd_uzs = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('12800.00'))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bank_name} - {self.card_number} ({self.card_holder}) {'[FAOL]' if self.is_active else '[NOFAOL]'}"

class DepositRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Kutilmoqda'),
        ('APPROVED', 'Tasdiqlangan'),
        ('REJECTED', 'Rad etilgan'),
    )

    deposit_id = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deposit_requests')
    amount_uzs = models.DecimalField(max_digits=16, decimal_places=2)
    amount_usd = models.DecimalField(max_digits=14, decimal_places=2)
    units_credited = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal('0.0000'))
    card_used = models.CharField(max_length=150, blank=True)
    receipt_image = models.ImageField(upload_to='receipts/deposits/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    admin_notes = models.TextField(blank=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_deposits')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Depozit #{self.deposit_id} - {self.user.full_name} (${self.amount_usd} / {self.amount_uzs} so'm) [{self.status}]"

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Kutilmoqda'),
        ('APPROVED', 'Tasdiqlangan'),
        ('PAID', 'To‘langan'),
        ('REJECTED', 'Rad etilgan'),
    )

    withdrawal_id = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='withdrawal_requests')
    amount_usd = models.DecimalField(max_digits=14, decimal_places=2)
    amount_uzs = models.DecimalField(max_digits=16, decimal_places=2)
    units_to_redeem = models.DecimalField(max_digits=18, decimal_places=4)
    target_card_number = models.CharField(max_length=30)
    target_card_holder = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Pul Yechish #{self.withdrawal_id} - {self.user.full_name} (${self.amount_usd}) [{self.status}]"

class TransactionLedger(models.Model):
    TX_TYPE_CHOICES = (
        ('DEPOSIT', 'Depozit kiritildi'),
        ('WITHDRAWAL', 'Mablag‘ yechib olindi'),
        ('PROFIT_SHARE', 'Sessiya foydasi tushdi'),
        ('LOSS_SHARE', 'Sessiya zarari hisoblandi'),
        ('REFERRAL_BONUS', 'Hamkorlik (Referal) bonusi'),
        ('PROP_EXAM_FEE', 'Prop-trading imtihon to‘lovi'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ledger_entries')
    tx_type = models.CharField(max_length=30, choices=TX_TYPE_CHOICES)
    amount_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    amount_uzs = models.DecimalField(max_digits=16, decimal_places=2, default=Decimal('0.00'))
    units_delta = models.DecimalField(max_digits=18, decimal_places=4, default=Decimal('0.0000'))
    balance_after_usd = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.user.full_name}: {self.tx_type} (${self.amount_usd})"
