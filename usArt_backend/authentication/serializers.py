from rest_framework import serializers
from authentication.models import UsArtUser,idChats


class UsArtUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    
    class Meta:
        model = UsArtUser
        fields = ('id', 'email', 'user_name', 'description', 'photo')


class SalaChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = idChats
        fields = ('id_sala', 'id_1', 'id_2')