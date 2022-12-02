from django.urls import path


from userprofile.views import PurchaseHistoryList, UserDetail, UserList, PurchaseHistoryDetail

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, UserProfile

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, UserProfile, ReviewUser, ReviewUserStars, ReviewList




app_name = 'userprofile'

urlpatterns = [
    path('<str:user_name>', UserDetail.as_view(), name='user_details'),
    path('purchases/', PurchaseHistoryList.as_view(), name='user_purchases'),
    path('users/', UserList.as_view(), name='users_list'),
    path('purchases/<str:pk>', PurchaseHistoryDetail.as_view(), name='user_purchase_detail'),
    path('update/', UserProfile.as_view(), name='update_profile'),
    path('review-artist/', ReviewUser.as_view(), name='review_artist'),
    path('review-artist/<str:author>', ReviewUserStars.as_view(), name='review_artist_puntuation'),
    path('review-list/<str:author>', ReviewList.as_view(), name='review_artist_list')

]
