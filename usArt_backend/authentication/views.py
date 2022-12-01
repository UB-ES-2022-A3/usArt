import io
from authentication.models import UsArtUser
from django.http import JsonResponse
from catalog.models import Publication
from rest_framework.parsers import JSONParser
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from authentication.models import UsArtUser, idChats
from authentication.serializers import UsArtUserSerializer, SalaChatSerializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404

from django.core.files.base import ContentFile


# Create your views here.
class UsArtUserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = UsArtUserSerializer()

class ChatsActivos(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = idChats.objects.all()

    def get(self, request):
        criterion1 = Q(id_1=request.user.id)
        criterion2 = Q(id_2=request.user.id)
        
        try:
            response = idChats.objects.filter(criterion1 | criterion2)
            chats = []
            for c in response:
                if c.id_2.id == request.user.id:
                    chats.append({'user':{
                            'id':c.id_1.id,
                            'user_name': c.id_1.user_name,
                            'photo': c.id_1.photo.url
                        } ,'id_sala': c.id_sala})
                elif c.id_1.id  == request.user.id:
                    chats.append({'user':{
                            'id':c.id_2.id,
                            'user_name': c.id_2.user_name,
                            'photo': c.id_2.photo.url
                        } ,'id_sala': c.id_sala})
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response({'chats':chats}, status=status.HTTP_200_OK)
        except:
            return Response({'message':'No hay chats'}, status=status.HTTP_204_NO_CONTENT)



class SalaChat(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = idChats.objects.all()

    def get(self, request, id):
        criterion1 = Q(id_1=request.user.id)
        criterion2 = Q(id_2=id)

        criterion3 = Q(id_1=id)
        criterion4 = Q(id_2=request.user.id)
        try:
            response = idChats.objects.get(
                criterion1 & criterion2 | criterion3 & criterion4)
            return Response(response.id_sala, status=status.HTTP_200_OK)

        except:

            user1 = UsArtUser.objects.get(id=request.user.id)
            user2 = UsArtUser.objects.get(id=id)

            myfile = ContentFile(b"")

            response = idChats.objects.create(id_1=user1, id_2=user2)

            response = idChats.objects.get(id_1=user1, id_2=user2)

            response.chat.save(str(response.id_sala)+'.txt', myfile)

            return Response(response.id_sala, status=status.HTTP_201_CREATED)


from django.core.files.storage import get_storage_class
import json
import datetime
class ChatPost(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = idChats.objects.all()

    def post(self, request):
        id_sala = request.data["id_sala"]

        response = get_object_or_404(idChats, id_sala=id_sala)

        dic = {"user":request.user.user_name,"message":request.data["message"],"time":datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")}

        text = json.dumps(dic)

        f = response.chat.open('r')
        l = f.readlines()
        st = ""         

        lines = [line.rstrip() for line in l]
        
        for i in lines:
            st += i.decode("utf-8") + " \n" 

        st += text 
       
        st = bytes(st,'utf-8') 
        
        myfile = ContentFile(st)

        response.chat.delete()
       
        response.chat.save(str(response.id_sala)+'.txt',myfile)

        return Response(dic, status=status.HTTP_201_CREATED)

class ChatHistory(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request,id):
        
        response = get_object_or_404( idChats,id_sala=id)

   
        if request.user.id != response.id_1.id and request.user.id != response.id_2.id:
            return Response("No eres parte de la conversación",status=status.HTTP_401_UNAUTHORIZED)


        f = response.chat.open('r')
        l = f.readlines()

        lines = []
        for line in l:
            lines.append(json.loads(line.rstrip().decode("utf-8")))

        

        return JsonResponse({'messages':lines},status=status.HTTP_200_OK)
