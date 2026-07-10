from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import User, UserCredentials, Transaction
from .serializers import UserSerializer
from .throttling import AuthRateThrottle


class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        token = request.data.get('credential')
        if not token:
            return Response({'error': 'Google token is required'}, status=400)

        try:
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({'error': 'Invalid Google token.'}, status=400)

        email = idinfo.get('email')
        full_name = idinfo.get('name', '')
        if not email:
            return Response({'error': 'Could not get email from Google'}, status=400)

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'full_name': full_name}
        )

        if created:
            # Set unusable password for Google users
            user.set_unusable_password()
            user.save()
            # Create credentials record
            UserCredentials.objects.create(user=user, is_email_verified=True)
            # Create profile
            from profiles.models import Profile
            Profile.objects.create(user=user)
            Transaction.objects.create(
                user=user,
                transaction_type='registration',
                status='success',
                description=f'Registered via Google OAuth. ID: {user.user_id}'
            )
        else:
            Transaction.objects.create(
                user=user,
                transaction_type='login',
                status='success',
                description='Logged in via Google OAuth'
            )

        if not user.is_active:
            return Response({'error': 'Your account has been deactivated.'}, status=403)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'is_new_user': created,
        }, status=status.HTTP_200_OK)
