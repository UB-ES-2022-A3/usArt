from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from authentication.models import UsArtUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.user_name
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        # ...
        return token


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = UsArtUser
        fields = ('user_name', 'password', 'email')

    def create(self, validated_data):
        user = UsArtUser.objects.create(
            user_name=validated_data['user_name'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user