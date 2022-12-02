from rest_framework import serializers
from catalog.models import Publication, PublicationImage
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
        for i, image in enumerate(validated_data['images']):
            imlist = image.split(",")
            imageStr = imlist[1] #remove data:image/png;base64,
            extension = imlist[0].split(';')[0].split('/')[1]
            image_64_decode = base64.b64decode(imageStr)
            im = ImageFile(io.BytesIO(image_64_decode), name= str(publication.id)+'_'+str(i)+'.' + extension)
            PublicationImage.objects.create(publication=publication, image=im)
        return publication