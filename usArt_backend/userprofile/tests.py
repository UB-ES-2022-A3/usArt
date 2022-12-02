from django.test import TestCase
from django.urls import reverse

from authentication.models import UsArtUser
from catalog.models import Publication
from userprofile.models import PurchaseHistory, Review

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
        self.assertEqual(purchase.price, 5.0)


class TestPublicationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        user2 = UsArtUser.objects.create_user(email='test2@test.com', user_name='test2', password='test2')
        user3 = UsArtUser.objects.create_user(email='test3@test.com', user_name='test3', password='test3')
        UsArtUser.objects.create_user(email='test4@test.com', user_name='test4', password='test4')
        publication = Publication.objects.create(title='Title test', description='Description test',
                                                 author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id=publication, price=publication.price, user_id=user2)
        PurchaseHistory.objects.create(pub_id=publication, price=6.0, user_id=user3)
        Review.objects.create(reviewed_id=user, reviewer_id=user2, stars=2, review="Bad work")
        Review.objects.create(reviewed_id=user, reviewer_id=user3, stars=4, review="Good work")

    def test_publication_content(self):
        purchase = PurchaseHistory.objects.get(price=5.0)
        self.assertEqual(purchase.price, 5.0)

    def test_update_profile(self):
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

        url = reverse('userprofile:update_profile')
        response = self.client.put(url, {'description' : 'a new description'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        url = reverse('userprofile:user_details', kwargs={'user_name': 'test2'})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'a new description')
    

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
        self.assertEqual(len(response.data), 4)
        # Devuelve todos los usuarios que contienen la palabra test2
        url = reverse('userprofile:users_list') + '?search=test2'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post_review_artist(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test4',
            'password': 'test4'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        url = reverse('userprofile:review_artist')
        author = UsArtUser.objects.get(user_name='test')
        data = {
            'reviewed_id': author.id,
            'stars': 4.0,
            'review': 'good work',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_review_artist_fail_login(self):
        url = reverse('userprofile:review_artist')
        author = UsArtUser.objects.get(user_name='test')
        data = {
            'reviewed_id': author.id,
            'stars': 4.0,
            'review': 'good work',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_reviews_from_user(self):
        url = reverse('userprofile:review_artist_puntuation', kwargs={'author': 'test'})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['average'], 3.0)
