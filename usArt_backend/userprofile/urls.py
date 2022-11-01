from django.urls import path
from userprofile import views
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('filter/<keywords>', views.items_search)
]