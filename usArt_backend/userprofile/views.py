from authentication.models import UsArtUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from userprofile.models import PurchaseHistory
from userprofile.serializers import PurchaseHistorySerializer, PublicationSerializer, UsArtUserSerializer, ExternalUserSerializer
from rest_framework import generics
import json
from catalog.models import Publication
from catalog.serializers import ItemSerializer, PublicationSerializer
from django.db.models import Q
from functools import reduce
import operator
from django.core.serializers import serialize
from rest_framework.permissions import BasePermission, SAFE_METHODS


# Create your views here.
def PurchaseHistory_list(request, username):
    #if (request.user.id == userid):
    #if (request.user.user == user):
    user_name = UsArtUser.objects.get(user_name = username)
    if (request.user.is_authenticated and request.user == user_name):
        if (request.method == 'GET'):
            # Agafem la llista de DB
            #full_history = PurchaseHistory.objects.filter(user_id = userid)
            full_history = PurchaseHistory.objects.filter(user = user_name)
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

class UserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset, user_name=self.kwargs['user_name'])
        return user

    def get_serializer(self, *args, **kwargs):
        user = UsArtUser.objects.get(user_name=self.kwargs['user_name'])
        if (self.request.user.user_name == self.kwargs['user_name']):
            return UsArtUserSerializer(user)
        else:
            return ExternalUserSerializer(user)
