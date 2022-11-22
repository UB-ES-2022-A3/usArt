from authentication.models import UsArtUser
from rest_framework import serializers
from catalog.serializers import PublicationListSerializer
from userprofile.models import PurchaseHistory, Fav
from catalog.models import Publication


class UsArtUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    is_self = serializers.BooleanField(default=True)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'email', 'description', 'photo', 'is_self')


class PurchaseHistorySerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)
    pub_id = PublicationListSerializer(read_only=True)

    class Meta:
        model = PurchaseHistory
        fields = '__all__'


class UsArtUserFilterSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'photo')


class ExternalUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    is_self = serializers.BooleanField(default=False)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'description', 'photo', 'is_self')


class FavSerializer(serializers.Serializer):
    user_id = UsArtUserSerializer()
    pub_id = PublicationListSerializer()

    """class Meta:
        model = Fav
        fields = ['user_id', 'pub_id']"""

    def create(self, validated_data):
        print(**validated_data)
        return Fav.objects.create(**validated_data)
