from django.urls import path
from catalog import views
from django.views.decorators.csrf import csrf_exempt




urlpatterns = [
    path('', views.PublicationList.as_view()),
    path('publicacionsuser/<username>',views.publicacionsuser),
    path('<int:pk>', views.ItemDetail.as_view())
]