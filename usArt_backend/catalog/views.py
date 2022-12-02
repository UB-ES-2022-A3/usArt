from rest_framework.generics import get_object_or_404
from catalog.models import Publication, PublicationImage, UsArtUser, Commission
from catalog.serializers import PublicationListSerializer, PublicationPostSerializer,CommissionListSerializer
from django.shortcuts import get_object_or_404

from authentication.models import UsArtUser
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters, generics, status
import django_filters.rest_framework

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


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


class CommissionPost(generics.CreateAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        pub = get_object_or_404(Publication, id=request.data['pub_id'])
        serialiser = CommissionListSerializer(data=request.data)
        serialiser.is_valid(raise_exception=True)
        serialiser.save(user_id=request.user, pub_id=pub)
        return Response(data=serialiser.data, status=status.HTTP_201_CREATED)



class PublicationPosting(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PublicationPostSerializer

    def perform_create(self, serializer):
        author = get_object_or_404(UsArtUser, id=self.request.user.id)
        serializer.save(author=author, images=self.request.data['images'])
