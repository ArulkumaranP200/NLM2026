from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from matrimony.validators import validate_uploaded_image
from .models import Profile, PartnerExpectation, ProfileView, ProfileUnlock
from accounts.serializers import UserSerializer

LOCKED_FIELDS = ['phone', 'present_address', 'sibling_details']


class PartnerExpectationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerExpectation
        exclude = ['profile']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expectation = PartnerExpectationSerializer(read_only=True)
    age = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_age(self, obj):
        if obj.date_of_birth:
            from datetime import date
            today = date.today()
            dob = obj.date_of_birth
            return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return None

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None

    def _can_view_locked(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        if obj.user_id == user.id:
            return True
        if user.role in ('admin', 'developer'):
            return True
        return ProfileUnlock.objects.filter(viewer=user, profile=obj).exists()

    def get_is_unlocked(self, obj):
        return self._can_view_locked(obj)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not self._can_view_locked(instance):
            for field in LOCKED_FIELDS:
                data[field] = None
        return data


class ProfileWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        exclude = ['user']

    def validate_photo(self, value):
        if value:
            try:
                validate_uploaded_image(value)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(list(exc.messages))
        return value


class ProfileViewSerializer(serializers.ModelSerializer):
    viewed_profile = ProfileSerializer(source='viewed', read_only=True)

    class Meta:
        model = ProfileView
        fields = ['id', 'viewed_profile', 'viewed_at']
