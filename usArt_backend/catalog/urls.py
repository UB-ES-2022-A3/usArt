from django.urls import path
from .views import ItemDetail
from catalog import views
from django.views.decorators.csrf import csrf_exempt




urlpatterns = [
    path('', views.item_list),
    path('publicacionsuser/<username>',views.publicacionsuser),
    path('<int:pk>', ItemDetail.as_view())
]