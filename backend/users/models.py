import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, phone, full_name, password=None, **extra_fields):
        if not phone:
            raise ValueError("Telefon raqami kiritilishi shart.")
        phone = phone.strip().replace(" ", "").replace("-", "")
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        user = self.model(phone=phone, full_name=full_name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser is_staff=True bo‘lishi kerak.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser is_superuser=True bo‘lishi kerak.')

        return self.create_user(phone, full_name, password, **extra_fields)

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin (XF)'),
        ('INVESTOR', 'Investor'),
        ('TRADER', 'Trader'),
    )

    username = None
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='INVESTOR')
    referral_code = models.CharField(max_length=16, unique=True, blank=True, db_index=True)
    referred_by = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals'
    )
    xp_points = models.PositiveIntegerField(default=0)
    telegram_id = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['full_name']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = f"XF{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.phone}) - {self.role}"
