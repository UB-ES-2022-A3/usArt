from rest_framework.response import Response

from authentication.models import UsArtUser

from django.shortcuts import get_object_or_404

from catalog.models import Publication
from userprofile import serializers
from userprofile.models import PurchaseHistory, Review

from rest_framework import filters, generics, status

from rest_framework.response import Response


from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView


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

    def get_queryset(self):
        return PurchaseHistory.objects.filter(user_id=self.request.user)


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
        user.photo = request.data.get('photo')
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
        