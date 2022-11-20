from django.urls import path

from userprofile.views import PurchaseHistoryList, UserDetail, UserSearch


app_name = 'userprofile'

urlpatterns = [
    path('<str:user_name>', UserDetail.as_view(), name='user_details'),
    path('purchases/', PurchaseHistoryList.as_view(), name='user_purchases'),
    path('filter/<keywords>', UserSearch.as_view(), name='user_search')
]
