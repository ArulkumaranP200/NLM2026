from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from matrimony.validators import validate_uploaded_image
from .models import User, UserCredentials, StaffCredentials, Transaction


class RegisterSerializer(serializers.Serializer):
    # Account fields
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    # Personal details
    phone = serializers.CharField(max_length=15)
    date_of_birth = serializers.DateField()
    gender = serializers.ChoiceField(choices=['male', 'female', 'other'])
    religion = serializers.ChoiceField(choices=['hindu', 'muslim', 'christian', 'sikh', 'jain', 'buddhist', 'other'])
    mother_tongue = serializers.CharField(max_length=50)
    marital_status = serializers.ChoiceField(choices=['never_married', 'divorced', 'widowed', 'separated'])
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, default='India')
    education = serializers.ChoiceField(choices=['high_school', 'diploma', 'bachelors', 'masters', 'phd', 'other'])
    occupation = serializers.CharField(max_length=100)
    # Optional
    caste = serializers.CharField(max_length=100, required=False, allow_blank=True)
    annual_income = serializers.CharField(max_length=50, required=False, allow_blank=True)
    about_me = serializers.CharField(required=False, allow_blank=True)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    weight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    present_address = serializers.CharField(required=False, allow_blank=True)
    zodiac_sign = serializers.CharField(max_length=50, required=False, allow_blank=True)
    nakshatra = serializers.CharField(max_length=50, required=False, allow_blank=True)
    birth_place = serializers.CharField(max_length=100, required=False, allow_blank=True)
    birth_time = serializers.TimeField(required=False, allow_null=True)
    photo = serializers.ImageField(required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value

    def validate_phone(self, value):
        import re
        if not re.match(r'^\+?[0-9]{10,15}$', value):
            raise serializers.ValidationError('Enter a valid phone number (10-15 digits).')
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def validate_photo(self, value):
        if value:
            try:
                validate_uploaded_image(value)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(list(exc.messages))
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        from datetime import date
        dob = data['date_of_birth']
        age = date.today().year - dob.year - ((date.today().month, date.today().day) < (dob.month, dob.day))
        if age < 18:
            raise serializers.ValidationError({'date_of_birth': 'You must be at least 18 years old.'})
        if age > 80:
            raise serializers.ValidationError({'date_of_birth': 'Please enter a valid date of birth.'})
        return data

    def create(self, validated_data):
        from profiles.models import Profile
        validated_data.pop('confirm_password')
        photo = validated_data.pop('photo', None)
        profile_fields = ['phone', 'date_of_birth', 'gender', 'religion', 'mother_tongue',
                          'marital_status', 'city', 'state', 'country', 'education',
                          'occupation', 'caste', 'annual_income', 'about_me',
                          'height', 'weight', 'present_address',
                          'zodiac_sign', 'nakshatra', 'birth_place', 'birth_time']
        profile_data = {k: validated_data.pop(k, '') for k in profile_fields}

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
        )
        # Create UserCredentials record
        UserCredentials.objects.create(user=user)
        # Create Profile with all details
        profile = Profile.objects.create(user=user, **{k: v for k, v in profile_data.items() if v})
        if photo:
            profile.photo = photo
            profile.save()
        # Log registration transaction
        Transaction.objects.create(user=user, transaction_type='registration', status='success',
                                   description=f'New user registered with ID {user.user_id}')
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Your account has been deactivated.')
        refresh = RefreshToken.for_user(user)
        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_id', 'email', 'full_name', 'role', 'is_active', 'date_joined']


class UserCredentialsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserCredentials
        fields = '__all__'


class StaffCredentialsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = StaffCredentials
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = '__all__'
