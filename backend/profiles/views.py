from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Profile, PartnerExpectation, ProfileView
from .serializers import (
    ProfileSerializer, ProfileWriteSerializer,
    PartnerExpectationSerializer, ProfileViewSerializer
)


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
        gender = request.query_params.get('gender')
        religion = request.query_params.get('religion')
        city = request.query_params.get('city')
        if gender:
            profiles = profiles.filter(gender=gender)
        if religion:
            profiles = profiles.filter(religion=religion)
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
