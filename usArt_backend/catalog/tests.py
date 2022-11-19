from django.test import TestCase
from django.urls import reverse

from authentication.models import UsArtUser
from catalog.models import Publication

from rest_framework import status
from rest_framework.test import APITestCase


class TestPublicationModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        Publication.objects.create(title='Title test', description='Description test',
                                   author_id=user.id, price=5.0)

    def test_publication_content(self):
        publication = Publication.objects.get(title='Title test')

        self.assertEqual(f'{publication.title}', 'Title test')
        self.assertEqual(f'{publication.description}', 'Description test')
        self.assertEqual(f'{publication.author}', 'test')
        self.assertEqual(publication.price, 5.0)


class TestPublicationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        Publication.objects.create(title='Title test', description='Description test', author_id=user.id, price=5.0)

    def test_get_publications(self):
        url = reverse('catalog:publications_list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_publication_detail(self):
        publication = Publication.objects.get(title='Title test')
        url = reverse('catalog:publication_details', kwargs={'pk': publication.id})
        response = self.client.get(url, format='json')
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_publication(self):
        pass

    def test_delete_publication(self):
        pass

    def test_get_user_publications(self):
        pass
