from rest_framework import generics
from catalog.models import Publication
from catalog.serializers import PublicationSerializer


class PublicationList(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer