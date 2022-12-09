from authentication.models import UsArtUser


from catalog.serializers import PublicationListSerializer

from rest_framework import serializers

from userprofile.models import PurchaseHistory, Review, Fav


class UsArtUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    is_self = serializers.BooleanField(default=True)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'email', 'description', 'photo', 'is_self')


class UsArtUserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsArtUser
        fields = ['user_name', 'status']


class PurchaseHistorySerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)
    pub_id = PublicationListSerializer(read_only=True)

    class Meta:
        model = PurchaseHistory
        fields = ('id','pub_id','price','user_id','date')


class UsArtUserFilterSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'photo','description')


class ExternalUserSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(allow_empty_file=True, use_url=True)
    is_self = serializers.BooleanField(default=False)

    class Meta:
        model = UsArtUser
        fields = ('id', 'user_name', 'description', 'photo', 'is_self')


class ReviewUserSerializer(serializers.ModelSerializer):
    reviewed_id = UsArtUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['reviewed_id', 'stars', 'review']

class ReviewerUserSerializer(serializers.ModelSerializer):
    reviewer_id = UsArtUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['reviewer_id', 'stars', 'review']


class FavSerializer(serializers.ModelSerializer):

    class Meta:
        model = Fav
        fields = ['pub_id']

    def create(self, validated_data):
        return Fav.objects.create(user_id=validated_data['user_id'], pub_id=validated_data['pub_id'])


class FavDelGetSerializer(serializers.ModelSerializer):
    user_id = UsArtUserSerializer(read_only=True)
    pub_id = PublicationListSerializer(read_only=True)

    class Meta:
        model = Fav
        fields = ['user_id', 'pub_id']
