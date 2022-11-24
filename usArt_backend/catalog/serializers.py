from rest_framework import serializers
from catalog.models import Publication, Commission
from authentication.serializers import UsArtUserSerializer


class PublicationImageField(serializers.RelatedField):
    def to_representation(self, value):
        return value.image.url


class PublicationListSerializer(serializers.ModelSerializer):
    images = PublicationImageField(many=True, read_only=True)
    author = UsArtUserSerializer(read_only=True)
    
    class Meta:
        model = Publication
        fields = ['id', 'title', 'description', 'author', 'price', 'images', 'type']


class CommissionListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commission
        fields = '__all__'
