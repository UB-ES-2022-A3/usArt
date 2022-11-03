from pickletools import read_long1
import re
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from userprofile.models import PurchaseHistory

class PurchaseHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    publication_title = serializers.CharField(required=True, max_length=100)
    author = serializers.CharField(required=True, max_length=200)
    price = serializers.FloatField(required=True)
    user_id = serializers.IntegerField(required=True)
    user = serializers.CharField(required=True, max_length=100)
    date = serializers.DateField(required = True)

    def create(self, validated_data):
        """
        Create and return a new `PurchaseHistory` instance, given the validated data.
        """
        return PurchaseHistory.objects.create(**validated_data)
    

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseHistory
        fields = ("id", "publication_title", "author", "price", "user_id", "user", "date" )
