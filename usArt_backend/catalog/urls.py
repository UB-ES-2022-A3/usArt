from django.urls import path
from catalog import views
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('', views.PublicationList.as_view()),
    path('publicacionsuser/<username>',views.publicacionsuser),
    path('<str:pk>', views.ItemDetail.as_view()),
    path('filter/<keywords>&<int:tag>', views.items_search)
]