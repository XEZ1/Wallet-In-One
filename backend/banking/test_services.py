from banking.services import *
from banking.models import Token
from django.test import TestCase

class ServicesTestCase(TestCase):

    def test_service(self):
        print('hi')
        # new_refresh_token()
        # a=Token.objects.all()[0]
        # a.refresh_token_expiration

        # get_access_token(force_regenerate = True)
        # a=Token.objects.all()[0]
        # a.access_token_expiration

        # a=Token.objects.all()[0]
        # a.refresh_token = 'invalid'
        # a.save()