from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("books.urls")),
    path('accounts/', include('dj_rest_auth.urls')),
    path('accounts/signup/', include('dj_rest_auth.registration.urls')),
    path('user/', include('accounts.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)