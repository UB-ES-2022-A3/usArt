
from rest_framework import filters, generics, status
from rest_framework.generics import get_object_or_404
from rest_framework.utils import json

from catalog.models import Publication, PublicationImage, Commission, Complaint
from catalog.serializers import PublicationListSerializer, PublicationPostSerializer, CommissionListSerializer, \
    ArtistCommissionListSerializer, ComplaintGetPutSerializer


from authentication.models import UsArtUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


import django_filters.rest_framework

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class PublicationList(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    filter_backends = (filters.SearchFilter,
                       django_filters.rest_framework.DjangoFilterBackend)
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


class PublicationDelete(generics.DestroyAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        pub = Publication.objects.get(id=self.kwargs["pub_id"])
        if (request.user == pub.author or request.user.is_superuser):
            self.perform_destroy(pub)
            return Response(status=status.HTTP_204_NO_CONTENT)            
        return Response(status=status.HTTP_403_NO_CONTENT)


class CommissionPost(generics.CreateAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        pub = get_object_or_404(Publication, id=request.data['pub_id'])
        com = Commission.objects.filter(
            pub_id=request.data['pub_id'], user_id=request.user.id)
        if len(com) == 0:
            serialiser = CommissionListSerializer(data=request.data)
        else:
            serialiser = CommissionListSerializer(com[0], data=request.data)
        serialiser.is_valid(raise_exception=True)
        serialiser.save(user_id=request.user, pub_id=pub)
        return Response(data=serialiser.data, status=status.HTTP_201_CREATED)


class CommissionList(generics.ListAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer

    def get_queryset(self):
        pub_id = self.kwargs['pub_id']
        commissions = Commission.objects.filter(
            pub_id__author=self.request.user, pub_id__id=pub_id)
        return commissions


class CommissionAcceptDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        commission = self.get_object()
        request.data['pub_id'] = self.kwargs['pub_id']
        request.data['user_id'] = self.kwargs['user_id']
        serializer = CommissionListSerializer(
            commission, data=self.request.data)
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

        commissions = Commission.objects.filter(
            pub_id__author=self.request.user, status="PD")
        return commissions


class PublicationPosting(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PublicationPostSerializer

    def perform_create(self, serializer):
        author = get_object_or_404(UsArtUser, id=self.request.user.id)
        serializer.save(author=author, images=self.request.data['images'])


class ComplaintGetPost(generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintGetPutSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response(status=status.HTTP_403_FORBIDDEN)
        com = Complaint.objects.filter(pub_id=self.kwargs["pub_id"])
        data = [ComplaintGetPutSerializer(x).data for x in list(com)]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        complainer = request.user
        pub = get_object_or_404(Publication, id=self.kwargs["pub_id"])
        if complainer.id == pub.author.id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        self.request.data["complainer_id"] = complainer.id
        self.request.data["pub_id"] = pub.id
        serializer = ComplaintGetPutSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(complainer_id=complainer, pub_id=pub)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class ComplaintPutDelete(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintGetPutSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            com = get_object_or_404(Complaint, id=self.kwargs["complaint_id"])
            self.request.data["complainer_id"] = com.complainer_id.id
            self.request.data["pub_id"] = com.pub_id.id
            self.request.data["reason"] = com.reason
            serializer = ComplaintGetPutSerializer(com, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, *args, **kwargs):
        if self.request.user.is_superuser:
            com = get_object_or_404(Complaint, id=self.kwargs["complaint_id"])
            self.perform_destroy(com)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)



