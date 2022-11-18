from rest_framework import serializers
from authentication.models import UsArtUser


class UsArtUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=False)
    
    class Meta:
        model = UsArtUser
        fields = ('id', 'email', 'user_name', 'description', 'photo')