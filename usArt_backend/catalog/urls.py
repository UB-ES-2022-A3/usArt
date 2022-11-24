from django.urls import path

from catalog import views


app_name = 'catalog'

urlpatterns = [
    path('', views.PublicationList.as_view(), name='publications_list'),
    path('<str:pk>', views.PublicationDetail.as_view(), name='publication_details'),
    path('user/<str:username>', views.PublicationUser.as_view(), name='publications_user'),
    path('user/comissions/<str:pub_id>', views.CommissionList.as_view(), name='commissions_user'),
]
