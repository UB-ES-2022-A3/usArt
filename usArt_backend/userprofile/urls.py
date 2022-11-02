from django.urls import path
from .views import PurchaseHistoryDetail
from userprofile import views
from django.views.decorators.csrf import csrf_exempt




urlpatterns = [
    #path('', views.PurchaseHistory_list),
    path('filter/<keywords>', views.items_search),
    path('purchasehistory/<username>', views.PurchaseHistory_list)
]