"""Tests of the stock account model."""
from django.test import TestCase
from django.core.exceptions import ValidationError
from stocks.models import StockAccount


class StockAccountModelTestCase(TestCase):

    fixtures = [
        'stocks/fixtures/stocks.json',
        'stocks/fixtures/user.json',
    ]

    def setUp(self):
        self.stock = StockAccount.objects.get(account_id='1')

    def _assert_stock_is_valid(self, stock):
        try:
            stock.full_clean()
        except ValidationError:
            self.fail("Stock Account is not valid.")

    def _assert_stock_is_invalid(self, stock):
        with self.assertRaises(ValidationError):
            stock.full_clean()

    def test_account_id_cannot_be_blank(self):
        self.stock.account_id = ''
        self._assert_stock_is_invalid(self.stock)

    def test_account_id_can_be_20_characters_long(self):
        self.stock.account_id = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_account_id_can_be_1024_characters_long(self):
        self.stock.account_id = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_account_id_cannot_be_1025_characters_long(self):
        self.stock.account_id = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_account_id_can_contain_numbers(self):
        self.stock.account_id = '123'
        self._assert_stock_is_valid(self.stock)

    def test_account_id_can_contain_special_characters(self):
        self.stock.account_id = '_@*&'
        self._assert_stock_is_valid(self.stock)

    def test_access_token_cannot_be_blank(self):
        self.stock.access_token = ''
        self._assert_stock_is_invalid(self.stock)

    def test_access_token_can_be_20_characters_long(self):
        self.stock.access_token = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_access_token_can_be_1024_characters_long(self):
        self.stock.access_token = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_access_token_cannot_be_1025_characters_long(self):
        self.stock.access_token = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_access_token_can_contain_numbers(self):
        self.stock.access_token = '123'
        self._assert_stock_is_valid(self.stock)

    def test_access_token_can_contain_special_characters(self):
        self.stock.access_token = '_@*&'
        self._assert_stock_is_valid(self.stock)

    def test_name_cannot_be_blank(self):
        self.stock.name = ''
        self._assert_stock_is_invalid(self.stock)

    def test_name_can_be_20_characters_long(self):
        self.stock.name = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_name_can_be_1024_characters_long(self):
        self.stock.name = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_name_cannot_be_1025_characters_long(self):
        self.stock.name = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_name_can_contain_numbers(self):
        self.stock.name = '123'
        self._assert_stock_is_valid(self.stock)

    def test_name_can_contain_special_characters(self):
        self.stock.name = '_@*&'
        self._assert_stock_is_valid(self.stock)

    def test_institution_name_cannot_be_blank(self):
        self.stock.institution_name = ''
        self._assert_stock_is_invalid(self.stock)

    def test_institution_name_can_be_20_characters_long(self):
        self.stock.institution_name = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_institution_name_can_be_1024_characters_long(self):
        self.stock.institution_name = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_institution_name_cannot_be_1025_characters_long(self):
        self.stock.institution_name = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_institution_name_can_contain_numbers(self):
        self.stock.institution_name = '123'
        self._assert_stock_is_valid(self.stock)

    def test_institution_name_can_contain_special_characters(self):
        self.stock.institution_name = '_@*&'
        self._assert_stock_is_valid(self.stock)

    def test_institution_id_cannot_be_blank(self):
        self.stock.institution_id = ''
        self._assert_stock_is_invalid(self.stock)

    def test_institution_id_can_be_20_characters_long(self):
        self.stock.institution_id = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_institution_id_can_be_1024_characters_long(self):
        self.stock.institution_id = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_institution_id_cannot_be_1025_characters_long(self):
        self.stock.institution_id = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_institution_id_can_contain_numbers(self):
        self.stock.institution_id = '123'
        self._assert_stock_is_valid(self.stock)

    def test_institution_id_can_contain_special_characters(self):
        self.stock.institution_id = '_@*&'
        self._assert_stock_is_valid(self.stock)