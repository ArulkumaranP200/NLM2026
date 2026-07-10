from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from matrimony.validators import validate_uploaded_image
from .models import Profile, PartnerExpectation, ProfileView
from accounts.serializers import UserSerializer


class PartnerExpectationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerExpectation
        exclude = ['profile']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expectation = PartnerExpectationSerializer(read_only=True)
    age = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

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
