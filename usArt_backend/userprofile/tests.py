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
        publication = Publication.objects.create(title='Title test', description='Description test', author_id=user.id, price=5.0)
        PurchaseHistory.objects.create(pub_id_id=publication.id, price=publication.price, user_id_id=user.id)


    def test_get_purchases(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        url = reverse('userprofile:User_purchases')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
