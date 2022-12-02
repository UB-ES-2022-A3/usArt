from catalog.models import Publication, Commission
from authentication.models import UsArtUser
from catalog.serializers import PublicationListSerializer,CommissionListSerializer,ArtistCommissionListSerializer
from rest_framework import filters, generics, status

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

    def put(self, request, *args, **kwargs):
        commission = self.get_object()
        request.data['pub_id'] = self.kwargs['pub_id']
        request.data['user_id'] = self.kwargs['user_id']
        serializer = CommissionListSerializer(commission, data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def get_object(self):
        commission = Commission.objects.get(pub_id__id=self.kwargs['pub_id'],
                                            user_id__id=self.kwargs['user_id'])
        return commission

        

class ArtistCommissionList(generics.ListAPIView):
    queryset = Commission.objects.all()
    serializer_class = ArtistCommissionListSerializer

    def get_queryset(self):
        
        commissions = Commission.objects.filter(pub_id__author=self.request.user,status="PD")
        return commissions