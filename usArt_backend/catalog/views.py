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
from django.db.models import Q
from functools import reduce
import operator

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

def items_search(request, keywords, tag):
    # falta gestionar tag quan funcioni
    #keywords = keywords.split(" ")
    print(keywords)
    if (request.method == 'GET'):
        if (tag == 0):
            items = Publication.objects.filter(Q(title__icontains = keywords) | Q(description__icontains = keywords) | Q(author__icontains = keywords))
            #items = Publication.objects.filter(reduce(operator.or_,(Q(title__icontains = x) for x in keywords)) | 
            #reduce(operator.or_,(Q(description__icontains = x) for x in keywords)) | 
            #reduce(operator.or_,(Q(author__icontains = x) for x in keywords)))
            serializer = ItemSerializer(items, many=True)
            return JsonResponse(serializer.data, safe=False)
        elif (tag == 1):
            pass
        else:
            pass
