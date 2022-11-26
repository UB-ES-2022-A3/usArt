from catalog.models import Publication, Commission
from catalog.serializers import PublicationListSerializer, CommissionListSerializer

from rest_framework import filters, generics

from authentication.models import UsArtUser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status



import django_filters.rest_framework


class PublicationList(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    filter_backends = (filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend)
    search_fields = ['title', 'description', 'author__user_name']
    filterset_fields = ['type']


class PublicationUser(generics.ListAPIView):
    serializer_class = PublicationListSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return Publication.objects.filter(author__user_name=username)


class PublicationDetail(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer


class CommissionList(generics.ListAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer

    def get_queryset(self):
        pub_id = self.kwargs['pub_id']
        commissions = Commission.objects.filter(pub_id__author=self.request.user, pub_id__id=pub_id)
        return commissions


class CommissionAcceptDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = get_object_or_404(UsArtUser, id=self.request.data['user_id'])
        pub = get_object_or_404(Publication, id=self.request.data['pub_id'])
        commission = Commission.objects.get(pub_id__id=self.request.data['pub_id'],
                                            user_id__id=self.request.data['user_id'])
        if not request.data['description'] and request.data['status']:
            data = {
                'user_id': request.data['user_id'],
                'pub_id': request.data['pub_id'],
                'description': commission.description,
                'status': request.data['status']
            }
        elif request.data['description'] and not request.data['status']:
            data = {
                'user_id': request.data['user_id'],
                'pub_id': request.data['pub_id'],
                'description': request.data['description'],
                'status': commission.status
            }
        elif request.data['description'] and request.data['status']:
            data = {
                'user_id': request.data['user_id'],
                'pub_id': request.data['pub_id'],
                'description': request.data['description'],
                'status': request.data['status']
            }
        else:
            return Response(request.data, status.HTTP_304_NOT_MODIFIED)
        serializer = CommissionListSerializer(commission, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request):
        if request.user.is_authenticated:
            commission = get_object_or_404(Commission, pub_id__id=self.request.data['pub_id'],
                                           user_id__id=request.data['user_id'])
            self.perform_destroy(commission)
            return Response(status=status.HTTP_204_NO_CONTENT)

