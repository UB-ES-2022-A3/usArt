from authentication.models import UsArtUser


from catalog.serializers import PublicationListSerializer

from rest_framework import serializers

from userprofile.models import PurchaseHistory, Review, Block


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

class BlockSerializer(serializers.ModelSerializer):

    class Meta:
        model = Block
        fields = ['blocker_id', 'blocked_id']
