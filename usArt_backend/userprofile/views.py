from cmath import log
from email import message
from http.client import HTTPResponse
import json
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
from django.core.serializers import serialize

# Create your views here.

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
    return JsonResponse({"username": user[0]["username"], "email": user[0]["email"]}, safe=False)
