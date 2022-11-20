from django.urls import path
from .views import PurchaseHistoryDetail
from userprofile import views
from django.views.decorators.csrf import csrf_exempt



app_name = 'userprofile'
urlpatterns = [
    path('<str:user_name>', views.UserDetail.as_view(), name='User_details'),
    path('purchasehistory', views.PurchaseHistoryList.as_view(), name='User_purchases'),
    path('filter/<keywords>', views.UserSearch.as_view(), name='User_search')
]