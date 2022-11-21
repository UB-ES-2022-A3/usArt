from catalog.models import Publication
from catalog.serializers import PublicationListSerializer

from rest_framework import filters, generics
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
