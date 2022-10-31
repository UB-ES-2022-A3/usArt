from django.urls import path
from .views import PurchaseHistoryDetail
from userprofile import views
from django.views.decorators.csrf import csrf_exempt




urlpatterns = [
    #path('', views.PurchaseHistory_list),
    path('purchasehistory/<int:userid>', views.PurchaseHistory_list)
]