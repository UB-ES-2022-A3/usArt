from django.urls import path


from userprofile.views import PurchaseHistoryList, UserDetail, UserList, FavList, UserProfile
from userprofile.views import FavGetDelete, PurchaseHistoryDetail, ReviewUser, ReviewUserStars, ReviewList, BanUser


from userprofile.views import PurchaseHistoryList, UserDetail, UserList, PurchaseHistoryDetail

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, UserProfile

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, UserProfile, ReviewUser, ReviewUserStars, ReviewList,UserBlocPut,UserBlockedGET,UserBlockerGET





app_name = 'userprofile'

urlpatterns = [
    path('<str:user_name>', UserDetail.as_view(), name='user_details'),
    path('purchases/', PurchaseHistoryList.as_view(), name='user_purchases'),
    path('users/', UserList.as_view(), name='users_list'),
    path('fav/', FavList.as_view(), name='post_user_fav'),
    path("get/delete/fav/<str:pub_id>", FavGetDelete.as_view(), name='get_delete_fav'),
    path('purchases/<str:id>', PurchaseHistoryDetail.as_view(), name='user_purchase_detail'),
    path('update/', UserProfile.as_view(), name='update_profile'),
    path('review-artist/', ReviewUser.as_view(), name='review_artist'),
    path('review-artist/<str:author>', ReviewUserStars.as_view(), name='review_artist_puntuation'),
    path('review-list/<str:author>', ReviewList.as_view(), name='review_artist_list'),

    path('bloc/<str:id>', UserBlocPut.as_view(), name = 'bloqued_user'),
    path('blocked/<str:id>', UserBlockedGET.as_view(), name='Userbloqued'),
    path('blocker/<str:id>', UserBlockerGET.as_view(), name='Userbloquer')

    path('ban-user/<str:user_name>', BanUser.as_view(), name='ban_user')


]
