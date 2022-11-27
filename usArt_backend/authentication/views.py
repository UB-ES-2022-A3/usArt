from authentication.models import UsArtUser
from django.http import JsonResponse
from catalog.models import Publication
from rest_framework.parsers import JSONParser
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from authentication.models import UsArtUser,idChats
from authentication.serializers import UsArtUserSerializer,SalaChatSerializer
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

# Create your views here.
class UsArtUserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = UsArtUserSerializer()
        
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class SalaChat(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = idChats.objects.all()

    def get(self,request,id):
        criterion1 = Q(id_1=request.user.id)
        criterion2 = Q(id_2=id)  

        criterion3 = Q(id_1=id)
        criterion4 = Q(id_2=request.user.id)
        try:
            response = idChats.objects.get(criterion1 & criterion2 | criterion3 & criterion4)
            return Response(response.id_sala,status=status.HTTP_200_OK)

        except:

            user1 = UsArtUser.objects.get(id=request.user.id)
            user2 = UsArtUser.objects.get(id=id)
        
            response = idChats.objects.create(id_1 = user1,id_2 = user2)

            return Response(response.id_sala, status=status.HTTP_201_CREATED)

        

    
#e21496d5-b4a7-40ac-bd65-72989e852b6a user



#e1669ca3-ee12-424c-bdb1-fbe74958483e jordi