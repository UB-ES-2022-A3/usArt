from pickletools import read_long1
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from catalog.models import Publication

class ItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True, max_length=100)
    description = serializers.CharField(required=True, max_length=200)
    author = serializers.CharField(required=True, max_length=200)
    price = serializers.FloatField(required=True)
    tag = serializers.IntegerField(required=True)

    def create(self, validated_data):
        """
        Create and return a new `Item` instance, given the validated data.
        """
        return Publication.objects.create(**validated_data)
    

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = ("id", "title", "description", "author", "price", "tag", "images", "review")
