from django.contrib import admin
from .models import Profile, PartnerExpectation, ProfileView

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'gender', 'religion', 'city', 'created_at']
    search_fields = ['user__full_name', 'user__email', 'city']

@admin.register(PartnerExpectation)
class ExpectationAdmin(admin.ModelAdmin):
    list_display = ['profile', 'min_age', 'max_age', 'religion']

@admin.register(ProfileView)
class ProfileViewAdmin(admin.ModelAdmin):
    list_display = ['viewer', 'viewed', 'viewed_at']
