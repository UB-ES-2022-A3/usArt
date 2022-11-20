from authentication.models import UsArtUser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from userprofile.models import PurchaseHistory
from userprofile.serializers import PurchaseHistorySerializer, PublicationSerializer, UsArtUserSerializer, ExternalUserSerializer, UsArtUserFilterSerializer
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated


class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)


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
        if not self.request.user.is_authenticated:
            return ExternalUserSerializer(user)
        if self.request.user.user_name == self.kwargs['user_name']:
            return UsArtUserSerializer(user)
        return ExternalUserSerializer(user)


class UserSearch(generics.ListAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = UsArtUserFilterSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['user_name']


"""def items_search(request, keywords):
    if (request.method == 'GET'):
        items = UsArtUser.objects.filter(user_name__icontains = keywords)
        serializer = UsArtUserFilterSerializer(items, many=True)
        return JsonResponse(serializer.data, safe=False)"""
