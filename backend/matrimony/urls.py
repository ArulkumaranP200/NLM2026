from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

def test(request):
    return HttpResponse("Backend is updated!")
urlpatterns = [
    path("test/", test),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/profiles/', include('profiles.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
