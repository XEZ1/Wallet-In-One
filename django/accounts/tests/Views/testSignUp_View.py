from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

class SignUpViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('sign_up')
        self.user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'username': 'johndoe',
            'email': 'johndoe@example.com',
            'new_password': 'Test@123',
            'password_confirmation': 'Test@123'
        }

    def test_signup_with_valid_data(self):
        response = self.client.post(self.signup_url, data=self.user_data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(get_user_model().objects.get().username, 'johndoe')

    def test_signup_with_invalid_data(self):
        self.user_data['new_password'] = 'testingtesting123'
        response = self.client.post(self.signup_url, data=self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_user_model().objects.count(), 0)
        self.assertEqual(response.data['new_password'], ['Password must contain an uppercase character, a lowercase character, a number and a special character.'])

    def test_signup_with_not_matching_passwords(self):
        self.user_data['password_confirmation'] = 'Test@1234'
        response = self.client.post(self.signup_url, data=self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_user_model().objects.count(), 0)
        self.assertEqual(response.data['new_password'], ["Password fields didn't match."])

    def test_signup_with_already_existing_email(self):
        #get_user_model().objects.create_user(**self.user_data)
        response = self.client.post(self.signup_url, data=self.user_data)
        response = self.client.post(self.signup_url, data=self.user_data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_user_model().objects.count(), 1)
        self.assertEqual(response.data['username'], ['user with this username already exists.'])
