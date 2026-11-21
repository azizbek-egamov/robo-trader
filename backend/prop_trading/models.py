from decimal import Decimal
from django.db import models
from django.conf import settings

class PropExam(models.Model):
    STATUS_CHOICES = (
        ('PENDING_PAYMENT_APPROVAL', 'To‘lov kutilmoqda / tekshirilmoqda'),
        ('ACTIVE', 'Faol (Imtihon jarayonida)'),
        ('PASSED', 'Imtihondan o‘tdi (Kapital beriladi)'),
        ('FAILED', 'Muvaffaqiyatsiz (Qoidalar buzildi)'),
        ('REJECTED', 'Rad etildi (To‘lov xato)'),
    )

    exam_id = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='prop_exams')
    fee_uzs = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('100000.00'))
    card_info_used = models.CharField(max_length=150, blank=True)
    receipt_image = models.ImageField(upload_to='receipts/prop_exams/', null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING_PAYMENT_APPROVAL', db_index=True)
    
    # MT5 Demo Credentials given by Admin after payment approval
    mt5_login = models.CharField(max_length=50, blank=True)
    mt5_password = models.CharField(max_length=100, blank=True)
    mt5_server = models.CharField(max_length=100, default='Alpari-MT5-Demo')
    demo_balance_usd = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('10000.00'))

    # Exam Rules & Objectives
    target_profit_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('9.00')) # 9%
    max_loss_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('6.00')) # 6%
    daily_loss_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('4.00')) # 4%

    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    activated_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Prop Imtihon #{self.exam_id} - {self.user.full_name} [{self.status}]"
