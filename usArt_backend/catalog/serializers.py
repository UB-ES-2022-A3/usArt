from rest_framework import serializers
from catalog.models import Publication, Commission, PublicationImage, Complaint, Auction, Bid
import datetime
from authentication.serializers import UsArtUserSerializer
import base64
import io
from django.core.files.images import ImageFile


class PublicationImageField(serializers.RelatedField):
    def to_representation(self, value):
        return value.image.url


class PublicationListSerializer(serializers.ModelSerializer):
    images = PublicationImageField(many=True, read_only=True)
    author = UsArtUserSerializer(read_only=True)
    
    class Meta:
        model = Publication
        fields = ['id', 'title', 'description', 'author', 'price', 'images', 'type']


class PublicationPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ['title', 'description', 'price', 'type']

    def create(self, validated_data):
        publication = Publication.objects.create(
            author=validated_data['author'],
            title=validated_data['title'],
            description=validated_data['description'],
            price=validated_data['price'],
            type=validated_data['type']
        )
        if validated_data['type'] == 'AU':
            Auction.objects.create(
                pub_id = publication,
                closure_date = datetime.date.today()+ datetime.timedelta(days=7),
                min_bid=validated_data['price'],
                stock=1
            )
        for i, image in enumerate(validated_data['images']):
            imlist = image.split(",")
            imageStr = imlist[1] # remove data:image/png;base64,
            extension = imlist[0].split(';')[0].split('/')[1]
            image_64_decode = base64.b64decode(imageStr)
            im = ImageFile(io.BytesIO(image_64_decode), name= str(publication.id)+'_'+str(i)+'.' + extension)
            PublicationImage.objects.create(publication=publication, image=im)
        return publication


class CommissionListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commission
        fields = '__all__'
        extra_kwargs = {'description': {'required': False},"user_id": {"required":False}}
        # extra_kwargs = {"user_id":{"required":False}}



class ArtistCommissionListSerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)

    class Meta:
        model = Commission
        fields = '__all__'

        extra_kwargs = {'description': {'required': False}, "user_id": {"required":False}}
        #extra_kwargs = {"user_id":{"required":False}}

class BiddingSerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ['auc_id', 'user_id', 'bid']

        extra_kwargs = {"user_id":{"required":False},"auc_id":{"required":False}}

class BiddingSerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ['auc_id', 'user_id', 'bid']

        extra_kwargs = {"user_id":{"required":False},"auc_id":{"required":False}}


class AuctionSerializer(serializers.ModelSerializer):
    pub_id = PublicationListSerializer(read_only=True)
    class Meta:
        model = Auction
        fields = ['pub_id','closure_date','staus', 'last_updated']
