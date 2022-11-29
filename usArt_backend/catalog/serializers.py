from rest_framework import serializers
from catalog.models import Publication, PublicationImage
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
        for image in validated_data['images']:
            PublicationImage.objects.create(publication=publication, image=image)
        return publication