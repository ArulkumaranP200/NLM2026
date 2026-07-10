import random
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


def generate_nlm_id():
    """Generate unique NLM + 4 digit ID, retry if exists."""
    while True:
        uid = f"NLM{random.randint(1000, 9999)}"
        if not User.objects.filter(user_id=uid).exists():
            return uid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        if 'user_id' not in extra_fields or not extra_fields['user_id']:
            extra_fields['user_id'] = generate_nlm_id()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'developer')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('developer', 'Developer'),
    ]
    user_id = models.CharField(max_length=10, unique=True, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.user_id} - {self.email}"


class UserCredentials(models.Model):
    """Stores hashed credential metadata for regular users."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credentials')
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    login_count = models.PositiveIntegerField(default=0)
    last_password_changed = models.DateTimeField(auto_now_add=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Credential'
        verbose_name_plural = 'User Credentials'

    def __str__(self):
        return f"Credentials: {self.user.user_id}"


class StaffCredentials(models.Model):
    """Stores credential metadata for admin/developer staff."""
    DEPARTMENT_CHOICES = [
        ('management', 'Management'),
        ('support', 'Support'),
        ('technical', 'Technical'),
        ('operations', 'Operations'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_credentials')
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES, default='management')
    employee_id = models.CharField(max_length=20, unique=True, blank=True)
    access_level = models.PositiveSmallIntegerField(default=1)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    login_count = models.PositiveIntegerField(default=0)
    last_password_changed = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Staff Credential'
        verbose_name_plural = 'Staff Credentials'

    def save(self, *args, **kwargs):
        if not self.employee_id:
            prefix = 'ADM' if self.user.role == 'admin' else 'DEV'
            self.employee_id = f"{prefix}{random.randint(1000, 9999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Staff: {self.user.user_id} ({self.user.role})"


class Transaction(models.Model):
    """Tracks all user activity/transactions in the system."""
    TRANSACTION_TYPES = [
        ('registration', 'Registration'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('profile_update', 'Profile Update'),
        ('profile_view', 'Profile View'),
        ('expectation_update', 'Expectation Update'),
        ('photo_upload', 'Photo Upload'),
        ('account_deactivated', 'Account Deactivated'),
        ('account_activated', 'Account Activated'),
        ('role_changed', 'Role Changed'),
    ]
    STATUS_CHOICES = [
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='success')
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'

    def __str__(self):
        return f"{self.user.user_id} - {self.transaction_type} - {self.status}"
