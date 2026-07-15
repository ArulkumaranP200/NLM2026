# from django.urls import path
# from .views import (RegisterView, LoginView, MeView, UserListView,
#                     UserCredentialsView, StaffCredentialsView,
#                     TransactionListView, MyTransactionsView, ThrottledTokenRefreshView)
# from .google_auth import GoogleLoginView

# urlpatterns = [
#     path('register/', RegisterView.as_view()),
#     path('login/', LoginView.as_view()),
#     path('google/', GoogleLoginView.as_view()),
#     path('me/', MeView.as_view()),
#     path('token/refresh/', ThrottledTokenRefreshView.as_view()),
#     path('users/', UserListView.as_view()),
#     path('users/<int:pk>/', UserListView.as_view()),
#     path('credentials/users/', UserCredentialsView.as_view()),
#     path('credentials/staff/', StaffCredentialsView.as_view()),
#     path('transactions/', TransactionListView.as_view()),
#     path('transactions/me/', MyTransactionsView.as_view()),
# ]
from django.http import HttpResponse
from django.contrib import admin
from django.urls import path, include

def test(request):
    return HttpResponse("Backend is updated!")

urlpatterns = [
    path("test/", test),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/profiles/", include("profiles.urls")),
]
