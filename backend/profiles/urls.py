from django.urls import path
from .views import (
    MyProfileView, ProfileListView, ProfileDetailView,
    CreatePaymentOrderView, VerifyPaymentView,
    ExpectationView, ViewedProfilesView, AdminProfileView, CasteListView
)

urlpatterns = [
    path('castes/', CasteListView.as_view()),
    path('me/', MyProfileView.as_view()),
    path('', ProfileListView.as_view()),
    path('<int:pk>/', ProfileDetailView.as_view()),
    path('<int:pk>/create-payment-order/', CreatePaymentOrderView.as_view()),
    path('<int:pk>/verify-payment/', VerifyPaymentView.as_view()),
    path('expectations/', ExpectationView.as_view()),
    path('viewed/', ViewedProfilesView.as_view()),
    path('admin/', AdminProfileView.as_view()),
    path('admin/<int:pk>/', AdminProfileView.as_view()),
]
