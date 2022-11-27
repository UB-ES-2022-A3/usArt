from authentication import views
from django.urls import path
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('users/<int:pk>', views.UsArtUserDetail.as_view()),
    path('chats/<str:id>', views.SalaChat.as_view()),
    path('chats/', views.ChatPost.as_view()),
    path('chatsHistory/<str:id>', views.ChatHistory.as_view())
]