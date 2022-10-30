from pickletools import read_long1
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from catalog.models import Publication

class PublicationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Publication
        fields = ['id', 'title', 'description', 'author', 'review']
    