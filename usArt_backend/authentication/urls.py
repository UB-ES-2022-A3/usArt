from authentication import views
from django.urls import path
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('users/<int:pk>', views.UsArtUserDetail.as_view())
]