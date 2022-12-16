from rest_framework.response import Response

from authentication.models import UsArtUser,idChats

from django.shortcuts import get_object_or_404

from catalog.serializers import PublicationListSerializer
from catalog.models import Publication

from userprofile import serializers
from userprofile.models import PurchaseHistory, Review, Fav

from rest_framework import filters, generics


from rest_framework.response import Response

from userprofile.models import Block
from userprofile.serializers import BlockSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.views import APIView
from django.db.models import Q

import base64
import io
from django.core.files.images import ImageFile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms.models import model_to_dict


class PurchaseHistoryList(generics.ListCreateAPIView):
    serializer_class = serializers.PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)

    def post(self, request):
        user = get_object_or_404(UsArtUser, id=request.user.id)
        publication = get_object_or_404(Publication, id=request.data['pub_id'])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user_id=user, pub_id=publication)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class PurchaseHistoryDetail(generics.RetrieveAPIView):
    serializer_class = serializers.PurchaseHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.kwargs["id"]
        return get_object_or_404(PurchaseHistory,id = id)
        

class UserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset, user_name=self.kwargs['user_name'])
        return user

    def get_serializer(self, *args, **kwargs):
        user = UsArtUser.objects.get(user_name=self.kwargs['user_name'])
        if not self.request.user.is_authenticated:
            return serializers.ExternalUserSerializer(user)
        if self.request.user.user_name == self.kwargs['user_name']:
            return serializers.UsArtUserSerializer(user)
        return serializers.ExternalUserSerializer(user)


class UserList(generics.ListAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = serializers.UsArtUserFilterSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['user_name']


class UserProfile(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        user=get_object_or_404(UsArtUser, user_name=request.user.user_name)
        if 'photo' in request.data:
            imlist = request.data['photo'].split(",")
            imageStr = imlist[1] #remove data:image/png;base64,
            extension = imlist[0].split(';')[0].split('/')[1]
            image_64_decode = base64.b64decode(imageStr)
            im = ImageFile(io.BytesIO(image_64_decode), name= str(user.id)+'.' + extension)
            user.photo = im
        if 'description' in request.data:
            user.description = request.data['description']
        user.save()
 
        return Response(status=status.HTTP_201_CREATED)


class ReviewUser(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = serializers.ReviewUserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = get_object_or_404(UsArtUser, id=self.request.user.id)
        author = get_object_or_404(UsArtUser, id=self.request.data['reviewed_id'])
        serializer.save(reviewer_id=user, reviewed_id=author)


class ReviewUserStars(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        author = get_object_or_404(UsArtUser, user_name=kwargs.get('author'))
        reviews = Review.objects.filter(reviewed_id=author)
        result = 0
        for review in reviews:
            result += review.stars
        try:
            total = result / len(reviews)
        except:
            total = 0
        return Response({'average': total}, status=status.HTTP_200_OK)


class ReviewList(generics.ListAPIView):
    serializer_class = serializers.ReviewerUserSerializer

    def get_queryset(self):
        return Review.objects.filter(reviewed_id__user_name=self.kwargs['author'])

        

class FavList(generics.ListCreateAPIView):
    queryset = Fav.objects.all()
    serializer_class = serializers.FavSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        pub = Publication.objects.get(id=self.request.data['pub_id'])
        serializer.save(user_id=self.request.user, pub_id=pub)

    def get_queryset(self):
        return Fav.objects.filter(user_id=self.request.user)


class FavGetDelete(generics.RetrieveDestroyAPIView):
    queryset = Fav.objects.all()
    serializer_class = serializers.FavDelGetSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pub = Publication.objects.get(id=self.kwargs['pub_id'])
        return get_object_or_404(Fav, user_id=self.request.user, pub_id=pub)




class UserBlocPut(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated]

    

    def put(self, request, *args, **kwargs):
        queryset = self.get_object()
        if queryset:
            self.perform_destroy(queryset)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            request.data['blocked_id'] = kwargs['id']
            request.data['blocker_id'] = request.user.id
            blocked_id = UsArtUser.objects.get(id=kwargs['id'])
            blocker_id = UsArtUser.objects.get(id=request.user.id)
            serializer = BlockSerializer(queryset, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(blocked_id=blocked_id,blocker_id=blocker_id)
            criterion1 = Q(id_1=request.user.id)
            criterion2 = Q(id_2=self.kwargs["id"])

            criterion3 = Q(id_1=self.kwargs["id"])
            criterion4 = Q(id_2=request.user.id)
            response = idChats.objects.filter(criterion1 & criterion2 | criterion3 & criterion4).delete()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    def get_object(self):
        try:
            block = Block.objects.get(blocked_id=self.kwargs['id'],
                                      blocker_id=self.request.user.id)
        except:
            block = None

        return block


class UserBlockedGET(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_object(self):

        block = get_object_or_404(Block, blocked_id=self.request.user.id, blocker_id=self.kwargs['id'])

        return block

class UserBlockerGET(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_object(self):

        block = get_object_or_404(Block, blocked_id=self.kwargs['id'], blocker_id=self.request.user.id)

        return block

class BanUser(generics.UpdateAPIView):
    queryset = UsArtUser.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = serializers.UsArtUserStatusSerializer
    lookup_field = 'user_name'

