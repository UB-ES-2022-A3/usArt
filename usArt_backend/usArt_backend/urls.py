"""usArt_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include,re_path
from chats.consumers import ChatConsumer


urlpatterns = [
    path('api/catalog/', include('catalog.urls', namespace='catalog')),
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('api/userprofile/', include('userprofile.urls', namespace='userprofile')),
    path('api/', include("api.urls", namespace='api')),
    path("chats/", ChatConsumer.as_asgi())

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
