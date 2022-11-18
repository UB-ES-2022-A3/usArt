from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

# Create your models here.

class AccountManager(BaseUserManager):

    def create_superuser(self, email, user_name, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if (other_fields.get('is_staff') is not True):
            raise ValueError('El super usuario debe de tener is_staff = True')

        if (other_fields.get('is_superuser') is not True):
            raise ValueError('El super usuario debe de tener is_superuser = True')

        return self.create_user(email, user_name, password, **other_fields)

    def create_user(self, email, user_name, password, **other_fields):
        if (not email):
            raise ValueError('El correo electronico es un campo obligatorio')

        if (not user_name):
            raise ValueError('El nombre de usuario es un campo obligatorio')

        email = self.normalize_email(email)
        user = self.model(email=email, user_name=user_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


def upload_to_photo(instance, filename):
    return 'photos/{}'.format(filename)


class UsArtUser(AbstractBaseUser, PermissionsMixin, models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField('Correo electronico', unique=True)
    user_name = models.CharField(max_length=150, unique=True)
    description = models.TextField(default="")
    photo = models.ImageField(upload_to=upload_to_photo, default='photos/default.jpg')
    is_staff = models.BooleanField(default=False)
    STATUS_CHOICES = [
        ('BAN', 'Banned'),
        ('ALO', 'Allowed')
    ]
    status = models.CharField(choices=STATUS_CHOICES, default='ALO', max_length=3)
    ban_date = models.DateTimeField(null=True)
    unban_date = models.DateTimeField(null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    objects = AccountManager()

    USERNAME_FIELD = 'user_name'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.user_name