from rest_framework import serializers
from catalog.models import Publication, PublicationImage

class PublicationImageField(serializers.RelatedField):
    
    def to_representation(self, value):
        return value.image.url


class PublicationSerializer(serializers.ModelSerializer):
    images = PublicationImageField(many=True, read_only=True)
    
    class Meta:
        model = Publication
        fields = ['id', 'title', 'description', 'author', 'price', 'review', 'images']
    