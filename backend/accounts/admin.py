from django.contrib import admin
from .models import User, UserCredentials, StaffCredentials, Transaction


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'email', 'full_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['user_id', 'email', 'full_name']
    readonly_fields = ['user_id', 'date_joined']


@admin.register(UserCredentials)
class UserCredentialsAdmin(admin.ModelAdmin):
    list_display = ['user', 'login_count', 'is_email_verified', 'last_login_ip', 'created_at']
    search_fields = ['user__user_id', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(StaffCredentials)
class StaffCredentialsAdmin(admin.ModelAdmin):
    list_display = ['user', 'employee_id', 'department', 'access_level', 'login_count', 'created_at']
    search_fields = ['user__user_id', 'employee_id']
    readonly_fields = ['employee_id', 'created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'status', 'ip_address', 'created_at']
    list_filter = ['transaction_type', 'status']
    search_fields = ['user__user_id', 'user__email']
    readonly_fields = ['created_at']
