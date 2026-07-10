from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import (RegisterSerializer, LoginSerializer, UserSerializer,
                          UserCredentialsSerializer, StaffCredentialsSerializer, TransactionSerializer)
from .models import User, UserCredentials, StaffCredentials, Transaction
from .throttling import AuthRateThrottle


class ThrottledTokenRefreshView(TokenRefreshView):
    throttle_classes = [AuthRateThrottle]


def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded.split(',')[0] if x_forwarded else request.META.get('REMOTE_ADDR')


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=request.data['email'])
            ip = get_client_ip(request)
            Transaction.objects.create(user=user, transaction_type='login',
                                       status='success', ip_address=ip,
                                       description='User logged in')
            if hasattr(user, 'credentials'):
                cred = user.credentials
                cred.login_count += 1
                cred.last_login_ip = ip
                cred.save()
            elif hasattr(user, 'staff_credentials'):
                cred = user.staff_credentials
                cred.login_count += 1
                cred.last_login_ip = ip
                cred.save()
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserListView(APIView):
    def get(self, request):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)

    def patch(self, request, pk):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        old_role = user.role
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            new_role = request.data.get('role', old_role)
            if new_role in ['admin', 'developer'] and not hasattr(user, 'staff_credentials'):
                StaffCredentials.objects.create(user=user)
            if old_role != new_role:
                Transaction.objects.create(user=user, transaction_type='role_changed',
                                           status='success',
                                           description=f'Role changed from {old_role} to {new_role}')
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=204)
        except User.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class UserCredentialsView(APIView):
    def get(self, request):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        creds = UserCredentials.objects.select_related('user').all()
        return Response(UserCredentialsSerializer(creds, many=True).data)


class StaffCredentialsView(APIView):
    def get(self, request):
        if request.user.role != 'developer':
            return Response({'error': 'Forbidden'}, status=403)
        creds = StaffCredentials.objects.select_related('user').all()
        return Response(StaffCredentialsSerializer(creds, many=True).data)


class TransactionListView(APIView):
    def get(self, request):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        txns = Transaction.objects.select_related('user').all()[:200]
        return Response(TransactionSerializer(txns, many=True).data)


class MyTransactionsView(APIView):
    def get(self, request):
        txns = Transaction.objects.filter(user=request.user)
        return Response(TransactionSerializer(txns, many=True).data)
