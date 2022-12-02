from django.urls import reverse

from authentication.models import UsArtUser

from rest_framework import status
from rest_framework.test import APITestCase


class TestAuthenticationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')

    def test_login_user(self):
        url_login = reverse('api:token_obtain_pair')
        data = {
            'user_name': 'test',
            'password': 'test'
        }
        response = self.client.post(url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)

    def test_register_user(self):
        url_register = reverse('api:auth_register')
        data = {
            'email': 'test2@test.com',
            'user_name': 'test2',
            'password': 'test2'
        }
        response = self.client.post(url_register, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        url_login = reverse('api:token_obtain_pair')
        data = {
            'user_name': 'test2',
            'password': 'test2'
        }
        response = self.client.post(url_login, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
