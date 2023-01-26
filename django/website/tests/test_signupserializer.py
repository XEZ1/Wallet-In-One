from django.test import TestCase
from rest_framework import serializers
from django import forms
from ..serializers import SignUpSerializer
from ..models import User

class SignUpSerializerTestCase(TestCase):
    """Sign up serializer unit tests"""


    def setUp(self):
        self.serializer_input = {
            'username': '@user',
            'first_name': 'Name',
            'last_name': 'Lastname',
            'email': 'namelastname@example.org',
            'new_password': 'Password123!',
            'password_confirmation': 'Password123!'
        }

    #Accept valid input data
    def test_valid_data_sign_up_serializer(self):
        serializer = SignUpSerializer(data=self.serializer_input)
        self.assertTrue(serializer.is_valid())