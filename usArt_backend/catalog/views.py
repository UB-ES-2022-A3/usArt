from cmath import log
from email import message
from http.client import HTTPResponse
from django.http import JsonResponse
from catalog.models import Publication
from catalog.serializers import ItemSerializer, PublicationSerializer
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework import generics

# Create your views here.
def item_list(request):
    if (request.method == 'GET'):
        # Agafem la llista de DB
        items = Publication.objects.all()
        # La convertim a diccionari
        serializer = ItemSerializer(items, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif (request.method == 'POST'):
        pass

    elif (request.method == 'PUT'):
        pass

    elif (request.method == 'DELETE'):
        pass

class ItemDetail(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
