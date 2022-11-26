from rest_framework.response import Response

from authentication.models import UsArtUser

from django.shortcuts import get_object_or_404

from catalog.models import Publication
from userprofile import serializers
from userprofile.models import PurchaseHistory

from rest_framework import filters, generics, status
from rest_framework.permissions import IsAuthenticated


class PurchaseHistoryList(generics.ListCreateAPIView):
    serializer_class = serializers.PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)

    def post(self, request):
        user = get_object_or_404(UsArtUser, id=request.user.id)
        publication = get_object_or_404(Publication, id=request.data['pub_id'])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user_id=user, pub_id=publication)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class PurchaseHistoryDetail(generics.RetrieveAPIView):
    serializer_class = serializers.PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)


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
