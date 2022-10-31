from cmath import log
from email import message
from http.client import HTTPResponse
from django.http import JsonResponse
from userprofile.models import PurchaseHistory
from userprofile.serializers import PurchaseHistorySerializer, PublicationSerializer
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework import generics


# Create your views here.
def PurchaseHistory_list(request, userid):
    if (request.user.id == userid):
        if (request.method == 'GET'):
            # Agafem la llista de DB
            full_history = PurchaseHistory.objects.filter(user_id = userid)
            # La convertim a diccionari
            serializer = PurchaseHistorySerializer(full_history, many=True)
            return JsonResponse(serializer.data, safe=False)

        elif (request.method == 'POST'):
            pass

        elif (request.method == 'PUT'):
            pass

        elif (request.method == 'DELETE'):
            pass
    else:
        return JsonResponse({"Not logged in":"Not logged in"})

class PurchaseHistoryDetail(generics.RetrieveAPIView):
    queryset = PurchaseHistory.objects.all()
    serializer_class = PublicationSerializer
