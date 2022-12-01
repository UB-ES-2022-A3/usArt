from django.test import TestCase
from django.urls import reverse

from authentication.models import UsArtUser
from catalog.models import Publication
from userprofile.models import PurchaseHistory, Fav

from rest_framework import status
from rest_framework.test import APITestCase


class TestPublicationModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        publication = Publication.objects.create(title='Title test', description='Description test', author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id=publication, price=publication.price, user_id=user)
        Fav.objects.create(user_id=user, pub_id=publication)

    def test_publication_content(self):
        purchase = PurchaseHistory.objects.get(price=5.0)
        """self.assertEqual(f'{purchase.user_id}', user.id)
        self.assertEqual(f'{purchase.pub_id}', publication.id)"""
        self.assertEqual(purchase.price, 5.0)

    def test_fav_content(self):
        user = UsArtUser.objects.get(user_name='test')
        fav = Fav.objects.get(user_id=user)
        self.assertEqual(fav.user_id, user)


class TestPublicationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        user2 = UsArtUser.objects.create_user(email='test2@test.com', user_name='test2', password='test2')
        publication = Publication.objects.create(title='Title test', description='Description test',
                                                 author_id=user.id, price=5.0)
        publication2 = Publication.objects.create(title='Title test2', description='Description test2',
                                                 author_id=user.id, price=5.0)
        publication3 = Publication.objects.create(title='Title test3', description='Description test3',
                                                 author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id=publication, price=publication.price, user_id=user2)
        Fav.objects.create(pub_id=publication2, user_id=user2)
        Fav.objects.create(pub_id=publication3, user_id=user2)

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

    def test_search_users(self):
        # Devuelve todos los usuarios que contiene la palabra test
        url = reverse('userprofile:users_list') + '?search=test'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Devuelve todos los usuarios que contienen la palabra test2
        url = reverse('userprofile:users_list') + '?search=test2'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post_fav(self):
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
        publication = Publication.objects.get(title='Title test')
        url = reverse('userprofile:post_user_fav')
        data = {'pub_id': publication.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_fav_lsit(self):
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
        url = reverse('userprofile:post_user_fav')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_fav(self):
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
        publication = Publication.objects.get(title='Title test2')
        url = reverse('userprofile:get_delete_fav', kwargs={'pub_id': publication.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_fav(self):
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
        publication = Publication.objects.get(title='Title test2')
        url = reverse('userprofile:get_delete_fav', kwargs={'pub_id': publication.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
