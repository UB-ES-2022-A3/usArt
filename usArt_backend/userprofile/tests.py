from django.test import TestCase
from django.urls import reverse

from authentication.models import UsArtUser
from catalog.models import Publication
from userprofile.models import PurchaseHistory

from rest_framework import status
from rest_framework.test import APITestCase


class TestPublicationModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        publication = Publication.objects.create(title='Title test', description='Description test', author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id=publication, price=publication.price, user_id=user)

    def test_publication_content(self):
        purchase = PurchaseHistory.objects.get(price=5.0)

        """self.assertEqual(f'{purchase.user_id}', user.id)
        self.assertEqual(f'{purchase.pub_id}', publication.id)"""
        self.assertEqual(purchase.price, 5.0)


class TestPublicationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        user2 = UsArtUser.objects.create_user(email='test2@test.com', user_name='test2', password='test2')
        publication = Publication.objects.create(title='Title test', description='Description test',
                                                 author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id=publication, price=publication.price, user_id=user2)

    def test_publication_content(self):
        purchase = PurchaseHistory.objects.get(price=5.0)

        """self.assertEqual(f'{purchase.user_id}', user.id)
        self.assertEqual(f'{purchase.pub_id}', publication.id)"""
        self.assertEqual(purchase.price, 5.0)

    def test_authentication(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test2'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        url = reverse('api:check')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_purchases(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test2'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        url = reverse('userprofile:user_purchases')
        response = self.client.get(url, format='json')
        user = response.data[0]['user_id']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(user['user_name'], 'test2')

    def test_get_purchases_fail_login(self):
        url = reverse('userprofile:user_purchases')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
