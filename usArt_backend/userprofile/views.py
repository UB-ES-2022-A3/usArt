from authentication.models import UsArtUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from userprofile.models import PurchaseHistory
from userprofile.serializers import PurchaseHistorySerializer, PublicationSerializer, UsArtUserSerializer, ExternalUserSerializer
from rest_framework import generics
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