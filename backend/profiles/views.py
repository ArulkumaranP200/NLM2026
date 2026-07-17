from datetime import date
from django.db.models import Q
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from accounts.models import Transaction
from .models import Profile, PartnerExpectation, ProfileView, ProfileUnlock
from .serializers import (
    ProfileSerializer, ProfileWriteSerializer,
    PartnerExpectationSerializer, ProfileViewSerializer
)

PROFILE_UNLOCK_PRICE = Decimal('99.00')

OPPOSITE_GENDER = {'male': 'female', 'female': 'male'}


def _is_any(value):
    return not value or value.strip().lower() == 'any'


def _years_ago(base_date, years):
    try:
        return base_date.replace(year=base_date.year - years)
    except ValueError:
        return base_date.replace(year=base_date.year - years, day=28)


class MyProfileView(APIView):
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileWriteSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ProfileSerializer(profile, context={'request': request}).data)
        return Response(serializer.errors, status=400)


class ProfileListView(APIView):
    def get(self, request):
        profiles = Profile.objects.exclude(user=request.user).select_related('user', 'expectation')

        my_profile = Profile.objects.filter(user=request.user).first()
        my_gender = (my_profile.gender if my_profile else '').strip().lower()
        opposite_gender = OPPOSITE_GENDER.get(my_gender)
        if opposite_gender:
            profiles = profiles.filter(gender__iexact=opposite_gender)

        use_expectations = request.query_params.get('my_expectations') == 'true'
        if use_expectations and my_profile and hasattr(my_profile, 'expectation'):
            exp = my_profile.expectation
            today = date.today()
            if exp.min_age:
                profiles = profiles.filter(date_of_birth__lte=_years_ago(today, exp.min_age))
            if exp.max_age:
                profiles = profiles.filter(date_of_birth__gte=_years_ago(today, exp.max_age + 1))
            if exp.min_height:
                profiles = profiles.filter(height__gte=exp.min_height)
            if exp.max_height:
                profiles = profiles.filter(height__lte=exp.max_height)
            if not _is_any(exp.religion):
                profiles = profiles.filter(religion__icontains=exp.religion.strip())
            if not _is_any(exp.caste):
                profiles = profiles.filter(caste__icontains=exp.caste.strip())
            if not _is_any(exp.education):
                profiles = profiles.filter(education__icontains=exp.education.strip())
            if not _is_any(exp.occupation):
                profiles = profiles.filter(occupation__icontains=exp.occupation.strip())
            if not _is_any(exp.marital_status):
                profiles = profiles.filter(marital_status__icontains=exp.marital_status.strip())
            if not _is_any(exp.location):
                location = exp.location.strip()
                profiles = profiles.filter(Q(city__icontains=location) | Q(state__icontains=location))
        else:
            religion = request.query_params.get('religion')
            caste = request.query_params.get('caste')
            city = request.query_params.get('city')
            if religion:
                profiles = profiles.filter(religion=religion)
            if caste:
                profiles = profiles.filter(caste=caste)
            if city:
                profiles = profiles.filter(city__icontains=city)

        serializer = ProfileSerializer(profiles, many=True, context={'request': request})
        return Response(serializer.data)


class ProfileDetailView(APIView):
    def get(self, request, pk):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        ProfileView.objects.get_or_create(viewer=request.user, viewed=profile)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)


class ProfileUnlockView(APIView):
    """Simulated payment: pays a fixed fee to unlock one profile's locked fields for the viewer."""
    def post(self, request, pk):
        try:
            profile = Profile.objects.get(pk=pk)
        except Profile.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        if profile.user_id == request.user.id:
            return Response({'error': 'This is your own profile.'}, status=400)

        unlock, created = ProfileUnlock.objects.get_or_create(
            viewer=request.user, profile=profile,
            defaults={'amount': PROFILE_UNLOCK_PRICE},
        )
        if created:
            Transaction.objects.create(
                user=request.user, transaction_type='payment', status='success',
                description=f'Paid ₹{unlock.amount} to unlock contact details of {profile.user.user_id}',
            )
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExpectationView(APIView):
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        expectation, _ = PartnerExpectation.objects.get_or_create(profile=profile)
        return Response(PartnerExpectationSerializer(expectation).data)

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        expectation, _ = PartnerExpectation.objects.get_or_create(profile=profile)
        serializer = PartnerExpectationSerializer(expectation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class ViewedProfilesView(APIView):
    def get(self, request):
        views = ProfileView.objects.filter(viewer=request.user).select_related('viewed__user')
        serializer = ProfileViewSerializer(views, many=True, context={'request': request})
        return Response(serializer.data)


class AdminProfileView(APIView):
    def get(self, request):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        profiles = Profile.objects.all().select_related('user')
        serializer = ProfileSerializer(profiles, many=True, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Forbidden'}, status=403)
        try:
            profile = Profile.objects.get(pk=pk)
            profile.delete()
            return Response(status=204)
        except Profile.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
