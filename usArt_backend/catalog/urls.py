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
    path('manage/post/', views.PublicationPosting.as_view(), name='post_publication'),
    path('manage/update/', views.PublicationUpdating.as_view(), name='update_publication'),
    path('auction/bid/', views.Bidding.as_view(), name='bidding'),
    path('auction/get/<str:pub_id>', views.AuctionGet.as_view(), name='auction_get'),
    path('auction/bidlist/<str:pub_id>', views.BidList.as_view(), name='bid_list'),
    path('complaint/get/post/<str:pub_id>', views.ComplaintGetPost.as_view(), name='complaint_get_post'),
    path('complaint/put/delete/<str:complaint_id>', views.ComplaintPutDelete.as_view(), name='complaint_put_delete')
]
