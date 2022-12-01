from django.urls import path

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, FavList, FavGetDelete


app_name = 'userprofile'

urlpatterns = [
    path('<str:user_name>', UserDetail.as_view(), name='user_details'),
    path('purchases/', PurchaseHistoryList.as_view(), name='user_purchases'),
    path('users/', UserList.as_view(), name='users_list'),
    path('fav/', FavList.as_view(), name='post_user_fav'),
    path("get/delete/fav/<str:pub_id>", FavGetDelete.as_view(), name='get_delete_fav')
]
