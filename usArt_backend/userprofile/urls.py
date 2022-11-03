from django.urls import path
from .views import PurchaseHistoryDetail
from userprofile import views
from django.views.decorators.csrf import csrf_exempt




urlpatterns = [
    path('<int:pk>', views.UserDetail.as_view()),
    path('purchasehistory/<username>', views.PurchaseHistory_list)
]