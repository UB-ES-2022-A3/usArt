from django.test import TestCase
from django.urls import reverse
from authentication.models import UsArtUser
from catalog.models import Publication, Commission

from rest_framework import status
from rest_framework.test import APITestCase


class TestPublicationModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        pub = Publication.objects.create(title='Title test', description='Description test', author_id=user.id,
                                         price=5.0)
        Commission.objects.create(pub_id=pub, user_id=user, description='Description test')

    def test_publication_content(self):
        publication = Publication.objects.get(title='Title test')

        self.assertEqual(f'{publication.title}', 'Title test')
        self.assertEqual(f'{publication.description}', 'Description test')
        self.assertEqual(f'{publication.author}', 'test')
        self.assertEqual(publication.price, 5.0)

    def test_commission_content(self):
        commission = Commission.objects.get(description='Description test')

        self.assertEqual(f'{commission.description}', 'Description test')



class TestPublicationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = UsArtUser.objects.create_user(email='test@test.com', user_name='test', password='test')
        user2 = UsArtUser.objects.create_user(email='test2@test.com', user_name='test2', password='test')
        user3 = UsArtUser.objects.create_user(email='test3@test.com', user_name='test3', password='test')
        superuser = UsArtUser.objects.create_superuser(email='super@test.com', user_name='super', password='super')
        Publication.objects.create(title='Title test', description='Description test', author_id=user.id, price=5.0)
        Publication.objects.create(title='Title test 2', description='Description test 2', author_id=user.id, price=8.0,
                                   type='CO')
        pub1 = Publication.objects.create(title='Title test 3', description='Description test 3',
                                          author=user2, price=5.0)
        Publication.objects.create(title='Title test 4', description='Description test 4',
                                          author=user2, price=5.0, type='AU')
        Commission.objects.create(pub_id=pub1, user_id=user, description='Description test user')
        Commission.objects.create(pub_id=pub1, user_id=user3, description='Description test user3')

    def test_get_publications(self):
        url = reverse('catalog:publications_list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_publications(self):
        url = reverse('catalog:publications_user', kwargs={'username': 'test'})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_publication_detail(self):
        publication = Publication.objects.get(title='Title test')
        url = reverse('catalog:publication_details', kwargs={'pk': publication.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_publication_delete(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        publication = Publication.objects.get(title='Title test')
        url = reverse('catalog:publication_details', kwargs={'pk': publication.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = reverse('catalog:publication_delete', kwargs={'pub_id': publication.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        url = reverse('catalog:publication_details', kwargs={'pk': publication.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_publications(self):
        url = reverse('catalog:publications_list') + '?search=test'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        # with space %20 returns both 'test2' and 'test 2'
        url = reverse('catalog:publications_list') + '?search=test%202'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        # without space returns only 'test2'
        url = reverse('catalog:publications_list') + '?search=test2'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_search_publicationns_type(self):
        url = reverse('catalog:publications_list') + '?search=test&type=CO'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        url = reverse('catalog:publications_list') + '?search=test&type=AR'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        url = reverse('catalog:publications_list') + '?search=test%203&type=AR'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_commissions_list(self):
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        pub = Publication.objects.get(title='Title test 3')
        url = reverse('catalog:commissions_user', kwargs={'pub_id':  str(pub.id)})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_commission_update(self):
        user = UsArtUser.objects.get(user_name='test')
        pub = Publication.objects.get(title='Title test 3')
        update_data = {
            'status': 'AC'
        }
        url = reverse('catalog:commission_update_delete', kwargs={'pub_id': pub.id, 'user_id': user.id})
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        update_data = {
            'status': 'AC'
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'AC')

        update_data2 = {
            'description': 'Description Changed',
            'status': 'DO'
        }
        response = self.client.put(url, update_data2, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'Description Changed')
        self.assertEqual(response.data['status'], 'DO')

        update_data3 = {
            'description': 'Description Changed',
        }
        response = self.client.put(url, update_data3, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'Description Changed')

        update_data4 = {
            'description': '',
        }
        response = self.client.put(url, update_data4, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_commission_delete(self):
        user = UsArtUser.objects.get(user_name='test')
        pub = Publication.objects.get(title='Title test 3')
        url = reverse('catalog:commission_update_delete', kwargs={'pub_id': pub.id, 'user_id': user.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_commission_post(self):
        user = UsArtUser.objects.get(user_name='test')
        pub = Publication.objects.get(title='Title test 3')
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))
        data = {
            'pub_id': pub.id,
            'description': 'test'
        }
        url = reverse('catalog:commission_post')
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_complaint(self):
        # post user test2
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test2',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        pub = Publication.objects.get(title='Title test')
        url = reverse('catalog:complaint_get_post', kwargs={'pub_id': pub.id})
        data = {
            'reason': 'fkdajgfk lajlgkfja kjfgdakñfañkmf ñkamdskñmjañk'
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # post user test
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'test',
            'password': 'test'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        pub = Publication.objects.get(title='Title test 3')
        url = reverse('catalog:complaint_get_post', kwargs={'pub_id': pub.id})
        data = {
            'reason': 'mnsdmgfbsdjghu nmg, zndgklsjdfli'
        }
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        id = response.data['id']

        # post forbidden
        pub = Publication.objects.get(title='Title test')
        url = reverse('catalog:complaint_get_post', kwargs={'pub_id': pub.id})
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # get forbidden
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # put forbidden
        data = {
            'status': 'AP'
        }
        url = reverse('catalog:complaint_put_delete', kwargs={'complaint_id': id})
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete forbidden
        url = reverse('catalog:complaint_put_delete', kwargs={'complaint_id': id})
        response = self.client.delete(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # get user superuser
        url_post_login = reverse('api:token_obtain_pair')
        login_data = {
            'user_name': 'super',
            'password': 'super'
        }
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        pub = Publication.objects.get(title='Title test 3')
        url = reverse('catalog:complaint_get_post', kwargs={'pub_id': pub.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # put user superuser 'AP'
        data = {
            'status': 'AP'
        }
        url = reverse('catalog:complaint_put_delete', kwargs={'complaint_id': id})
        response = self.client.put(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'AP')

        # delete user superuser 'AP'
        url = reverse('catalog:complaint_put_delete', kwargs={'complaint_id': id})
        response = self.client.delete(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
