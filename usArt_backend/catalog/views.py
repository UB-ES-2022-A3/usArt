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


class PublicationsSearch(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['title', 'description', 'author__user_name']


"""def items_search(request, keywords, tag):
    if (request.method == 'GET'):
       
        items = Publication.objects.filter((Q(title__icontains = keywords) | Q(description__icontains = keywords)) & Q(tag = tag))
        serializer = PublicationListSerializer(items, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        pass"""
