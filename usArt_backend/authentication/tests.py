from django.test import TestCase
from django.urls import reverse

from authentication.models import UsArtUser, idChats

from rest_framework import status
from rest_framework.test import APITestCase


class TestChatModel(APITestCase):
    @classmethod
    def setUpTestData(cls):
        UsArtUser.objects.create_user(
            email='test@test.com', user_name='test', password='test')
        UsArtUser.objects.create_user(
            email='test1@test.com', user_name='test1', password='test1')

    def test_get_sala_chat(self):  # Test get sala chat

        login_data = {
            'user_name': 'test',
            'password': 'test'
        }

        url_post_login = reverse('api:token_obtain_pair')
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        idTest = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test'}))
        idTest2 = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test1'}))

        url = reverse("authentication:id_sala", kwargs={
                      'id': idTest2.data['id']})

        response = self.client.get(url)

        # se crea la sala porque no existe
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        url = reverse("authentication:id_sala", kwargs={
                      'id': idTest2.data['id']})

        response = self.client.get(url)
        # devuelve la misma la sala porque ya existe
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_sala_chat(self):  # Test post sala chat

        login_data = {
            'user_name': 'test',
            'password': 'test'
        }

        url_post_login = reverse('api:token_obtain_pair')
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        idTest = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test'}))
        idTest2 = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test1'}))

        url = reverse("authentication:id_sala", kwargs={
                      'id': idTest2.data['id']})

        response = self.client.get(url)

        # se crea la sala porque no existe
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #escribimos mensaje

        data = {
            "id_sala": response.data,
            "user": "user",
            "message": "hola"
        }
        url = reverse("authentication:post_chat")

        response = self.client.post(url,data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_history_chat(self):  # Test get chat history

        login_data = {
            'user_name': 'test',
            'password': 'test'
        }

        url_post_login = reverse('api:token_obtain_pair')
        response = self.client.post(url_post_login, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        token = response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION='JWT {}'.format(token))

        idTest = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test'}))
        idTest2 = self.client.get(
            reverse("userprofile:user_details", kwargs={'user_name': 'test1'}))

        url = reverse("authentication:id_sala", kwargs={
                      'id': idTest2.data['id']})

        response = self.client.get(url)

        # se crea la sala porque no existe
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #escribimos mensajes en la sala
        sala_id = (response.data)
        
        data = {
            "id_sala": sala_id,
            "user": idTest2.data['user_name'],
            "message": "hola"
        }
        url = reverse("authentication:post_chat")

        response = self.client.post(url,data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #recuperamos los mensajes

        url = reverse("authentication:chat_history",kwargs={
                      'id': sala_id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["messages"][0]["user"],idTest.data['user_name'])
        self.assertEqual(response.json()["messages"][0]["message"],"hola")

        


    




