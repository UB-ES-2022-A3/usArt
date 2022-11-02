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
import json
from catalog.models import Publication
from catalog.serializers import ItemSerializer, PublicationSerializer
from django.db.models import Q
from functools import reduce
import operator
from django.core.serializers import serialize

# Create your views here.
def PurchaseHistory_list(request, username):
    #if (request.user.id == userid):
    #if (request.user.user == user):
    username = User.objects.get(username = username)
    if (request.user.is_authenticated and request.user == username):
        if (request.method == 'GET'):
            # Agafem la llista de DB
            #full_history = PurchaseHistory.objects.filter(user_id = userid)
            full_history = PurchaseHistory.objects.filter(user = username)
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


def items_search(request, keywords):
    # falta gestionar tag quan funcioni
    #keywords = keywords.split(" ")
    items = User.objects.filter(username = keywords)
    #items = Publication.objects.filter(reduce(operator.or_,(Q(title__icontains = x) for x in keywords)) | 
    #reduce(operator.or_,(Q(description__icontains = x) for x in keywords)) | 
    #reduce(operator.or_,(Q(author__icontains = x) for x in keywords)))
    user = serialize("json", items)
    user = [obj["fields"] for obj in json.loads(user)]
    # falta añadir datos del perfil de usuario (no está hecho)
    return JsonResponse({"username": user[0]["username"]}, safe=False)
