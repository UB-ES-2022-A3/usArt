from catalog.models import Publication, PublicationImage
from catalog.serializers import PublicationListSerializer, PublicationPostSerializer

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


class PublicationPosting(generics.CreateAPIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        publication_serializer = PublicationPostSerializer(data=request.data)
        if not publication_serializer.is_valid():
            return Response(publication_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        res = Publication.objects.create(
            author=request.user,
            title=request.data['title'],
            description=request.data['description'],
            price=request.data['price'],
            type=request.data['type']
        )
        for im in request.FILES.getlist('images'):
            PublicationImage.objects.create(publication=res, image=im)
        return Response(publication_serializer.data, status=status.HTTP_201_CREATED)
