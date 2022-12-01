from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from authentication.models import UsArtUser
from catalog.models import Publication, Commission
from catalog.serializers import PublicationListSerializer,CommissionListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters, generics, status
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


class CommissionPost(generics.CreateAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        pub = get_object_or_404(Publication, id=request.data['pub_id'])
        print(request.user,pub)
        serialiser = CommissionListSerializer(data=request.data)
        serialiser.is_valid(raise_exception=True)
        serialiser.save(user_id=request.user, pub_id=pub)
        return Response(data=serialiser.data, status=status.HTTP_201_CREATED)
