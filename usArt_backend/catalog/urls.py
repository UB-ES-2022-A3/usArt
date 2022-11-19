from django.urls import path
from catalog import views
from django.views.decorators.csrf import csrf_exempt

app_name = 'catalog'

urlpatterns = [
    path('', views.PublicationList.as_view(), name='publications_list'),
    path('publicacionsuser/<username>', views.publicacionsuser),
    path('<str:pk>', views.PublicationDetail.as_view(), name='publication_details'),
    path('filter/<keywords>&<int:tag>', views.items_search)
]