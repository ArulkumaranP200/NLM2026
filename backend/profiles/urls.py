from django.urls import path
from .views import (
    MyProfileView, ProfileListView, ProfileDetailView, ProfileUnlockView,
    ExpectationView, ViewedProfilesView, AdminProfileView
)

urlpatterns = [
    path('me/', MyProfileView.as_view()),
    path('', ProfileListView.as_view()),
    path('<int:pk>/', ProfileDetailView.as_view()),
    path('<int:pk>/unlock/', ProfileUnlockView.as_view()),
    path('expectations/', ExpectationView.as_view()),
    path('viewed/', ViewedProfilesView.as_view()),
    path('admin/', AdminProfileView.as_view()),
    path('admin/<int:pk>/', AdminProfileView.as_view()),
]
