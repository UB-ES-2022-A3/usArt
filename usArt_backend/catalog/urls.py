from django.urls import path

from catalog import views


app_name = 'catalog'

urlpatterns = [
    path('', views.PublicationList.as_view(), name='publications_list'),
    path('<str:pk>', views.PublicationDetail.as_view(), name='publication_details'),
    path('delete/<str:pub_id>', views.PublicationDelete.as_view(), name='publication_delete'),
    path('user/<str:username>', views.PublicationUser.as_view(), name='publications_user'),

    path('user/commissions/<str:pub_id>', views.CommissionList.as_view(), name='commissions_user'),
    path('user/commissions/list/', views.ArtistCommissionList.as_view(), name='list_comissions'),
    path('user/commission/<str:pub_id>&<str:user_id>', views.CommissionAcceptDelete.as_view(),name='commission_update_delete'),
    path('user/commission/post/', views.CommissionPost.as_view(), name='commission_post'),
    path('manage/post/', views.PublicationPosting.as_view(), name='post_publication')

]
