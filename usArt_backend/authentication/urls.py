from authentication import views
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

app_name = 'authentication'

urlpatterns = [
    path('users/<int:pk>', views.UsArtUserDetail.as_view(),name="user_detail"),
    path('chats/<str:id>', views.SalaChat.as_view(),name="id_sala"),
    path('postchat/', views.ChatPost.as_view(),name="post_chat"),
    path('chatsHistory/<str:id>', views.ChatHistory.as_view(),name="chat_history"),
    path('activechats/', views.ChatsActivos.as_view(), name='active_chats')
]