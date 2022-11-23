from django.urls import path

from userprofile.views import PurchaseHistoryList, UserDetail, UserList, FavList


app_name = 'userprofile'

urlpatterns = [
    path('<str:user_name>', UserDetail.as_view(), name='user_details'),
    path('purchases/', PurchaseHistoryList.as_view(), name='user_purchases'),
    path('users/', UserList.as_view(), name='users_list'),
    path('addfav/', FavList.as_view(), name='post_user_fav')
]
