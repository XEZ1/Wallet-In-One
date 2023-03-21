from django.test import TestCase
from banking.services import *
from banking.models import Token
from unittest.mock import patch
from django.utils import timezone

class ServiceRouteTestCase(TestCase):
    # Can't use real accounts because it would contains personal information
    # These tests are just making sure these helper functions are able to call the api.

    def test_get_account_data_calls_api(self):
        self.assertEquals(get_account_data('1'),{'summary': 'Not found.', 'detail': 'Not found.', 'status_code': 404})

    def test_get_account_balances_calls_api(self):
        self.assertEquals(get_account_balances('1'),{'summary': 'Invalid Account ID', 'detail': '1 is not a valid Account UUID. ', 'status_code': 400})

    def test_get_account_transactions_calls_api(self):
        self.assertEquals(get_account_transactions('1'),{'summary': 'Invalid Account ID', 'detail': '1 is not a valid Account UUID. ', 'status_code': 400})

    def test_get_account_details_calls_api(self):
        self.assertEquals(get_account_details('1'),{'summary': 'Invalid Account ID', 'detail': '1 is not a valid Account UUID. ', 'status_code': 400})

    def test_get_institution_calls_api(self):
        self.assertEquals(get_institution('bank'),{'summary': 'Not found.', 'detail': 'Not found.', 'status_code': 404})

    def test_get_requisitions_calls_api(self):
        self.assertEquals(get_requisitions('1'),{'summary': 'Not found.', 'detail': 'Not found.', 'status_code': 404})
