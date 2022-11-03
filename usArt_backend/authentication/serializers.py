from rest_framework import serializers
from authentication.models import UsArtUser


class UsArtUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    
    class Meta:
        model = UsArtUser
        fields = ('id', 'email', 'user_name', 'description', 'is_artist', 'photo')