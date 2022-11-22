from authentication.models import UsArtUser

from django.shortcuts import get_object_or_404

from catalog.serializers import PublicationListSerializer
from catalog.models import Publication

from userprofile import serializers
from userprofile.models import PurchaseHistory, Fav

from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict

class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = serializers.PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)


class PurchaseHistoryDetail(generics.RetrieveAPIView):
    queryset = PurchaseHistory.objects.all()
    serializer_class = PublicationListSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset, user_name=self.kwargs['user_name'])
        return user

    def get_serializer(self, *args, **kwargs):
        user = UsArtUser.objects.get(user_name=self.kwargs['user_name'])
        if not self.request.user.is_authenticated:
            return serializers.ExternalUserSerializer(user)
        if self.request.user.user_name == self.kwargs['user_name']:
            return serializers.UsArtUserSerializer(user)
        return serializers.ExternalUserSerializer(user)


class UserList(generics.ListAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = serializers.UsArtUserFilterSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['user_name']


class FavList(generics.CreateAPIView):
    queryset = Fav.objects.all()
    serializer_class = serializers.FavSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user_id'] = request.user
        request.data['pub_id'] = Publication.objects.get(id=request.data['pub_id'])
        obj = serializers.FavSerializer(data=request.data)
        if obj.is_valid():
            #print(obj.data)
            return Response(data=obj.data, status=status.HTTP_201_CREATED)
        return Response(data=obj.data, status=status.HTTP_400_BAD_REQUEST)
