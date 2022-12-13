
from rest_framework import filters, generics, status
from catalog.models import Publication, UsArtUser, Commission, Auction, Bid
from catalog.serializers import PublicationListSerializer, PublicationPostSerializer, CommissionListSerializer,ArtistCommissionListSerializer, BiddingSerializer, AuctionSerializer
from django.shortcuts import get_object_or_404
from authentication.models import UsArtUser
import django_filters.rest_framework
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from pusher import Pusher

pusher = Pusher(app_id=u'1519042', key=u'464bf9750a028fa769ca', secret=u'215b58084e762c8107c6', cluster=u'eu')


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


class PublicationDelete(generics.DestroyAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        pub = Publication.objects.get(author=self.request.user, id=self.kwargs["pub_id"])
        self.perform_destroy(pub)
        return Response(status=status.HTTP_204_NO_CONTENT)

 
class CommissionPost(generics.CreateAPIView):
    queryset = Commission.objects.all()
    serializer_class = CommissionListSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        pub = get_object_or_404(Publication, id=request.data['pub_id'])
        com = Commission.objects.filter(pub_id = request.data['pub_id'],user_id=request.user.id)
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


class PublicationPosting(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PublicationPostSerializer

    def perform_create(self, serializer):
        author = get_object_or_404(UsArtUser, id=self.request.user.id)
        serializer.save(author=author, images=self.request.data['images'])


class Bidding(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        auc = get_object_or_404(Auction, pub_id=request.data['pub_id'])
        bid = Bid.objects.filter(auc_id = auc,user_id=request.user.id)
        if len(bid) == 0:
            serializer = BiddingSerializer(data=request.data)
        else:
            serializer = BiddingSerializer(bid[0], data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user_id=request.user, auc_id=auc)

        if auc.min_bid < float(request.data['bid']):
            Auction.objects.filter(pub_id=auc.pub_id).update(min_bid=float(request.data['bid']))

        dic = {
            "auc_id": str(serializer.data['auc_id']),
            "user_id": {
                "id": serializer.data['user_id']['id'],
                "email": serializer.data['user_id']['email'],
                "user_name": serializer.data['user_id']['user_name'],
                "description": serializer.data['user_id']['description'],
                "photo": serializer.data['user_id']['photo']
            },
            "bid": str(serializer.data['bid'])
        }
        pusher.trigger(str(request.data['pub_id']), u'subasta', dic)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

class BidList(generics.ListAPIView):
    queryset = Bid.objects.all()
    serializer_class = BiddingSerializer

    def get_queryset(self):
        pub_id = self.kwargs['pub_id']
        bids = Bid.objects.filter(auc_id=pub_id).order_by('-bid')
        return bids

class AuctionGet(generics.ListAPIView):
    queryset = Auction.objects.all()

    def get(self, request, pub_id):
        auction = Auction.objects.get(pub_id=pub_id)
        serializer = AuctionSerializer(auction)
        return Response(serializer.data, status=status.HTTP_200_OK)