from django.test import TestCase
from stocks.models import Stock
from django.core.exceptions import ValidationError

class StockModelTestCase(TestCase):

    fixtures = [
        'stocks/tests/fixtures/stocks.json',
        'stocks/tests/fixtures/user.json',
    ]

    def setUp(self):
        self.stock = Stock.objects.get(pk=1)

    def _assert_stock_is_valid(self, stock):
        try:
            stock.full_clean()
        except ValidationError:
            self.fail("Stock Account is not valid.")

    def _assert_stock_is_invalid(self, stock):
        with self.assertRaises(ValidationError):
            stock.full_clean()

    def test_stock_is_valid(self):
        self._assert_stock_is_valid(self.stock)

    def test_name_cannot_be_blank(self):
        self.stock.name = ''
        self._assert_stock_is_invalid(self.stock)

    def test_name_cannot_be_none(self):
        self.stock.name = None
        self._assert_stock_is_invalid(self.stock)

    def test_name_can_be_20_characters(self):
        self.stock.name = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_name_can_be_1024_characters(self):
        self.stock.name = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_name_cannot_be_1025_characters(self):
        self.stock.name = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_name_can_contain_numbers(self):
        self.stock.name = '123'
        self._assert_stock_is_valid(self.stock)

    def test_name_can_contain_special_characters(self):
        self.stock.name = '_@*&'
        self._assert_stock_is_valid(self.stock)

    def test_ticker_symbol_cannot_be_blank(self):
        self.stock.ticker_symbol = ''
        self._assert_stock_is_invalid(self.stock)

    def test_ticker_symbol_cannot_be_none(self):
        self.stock.ticker_symbol = None
        self._assert_stock_is_invalid(self.stock)

    def test_ticker_symbol_can_be_20_characters(self):
        self.stock.ticker_symbol = 'a' * 20
        self._assert_stock_is_valid(self.stock)

    def test_ticker_symbol_can_be_1024_characters(self):
        self.stock.ticker_symbol = 'a' * 1024
        self._assert_stock_is_valid(self.stock)

    def test_ticker_symbol_cannot_be_1025_characters(self):
        self.stock.ticker_symbol = 'a' * 1025
        self._assert_stock_is_invalid(self.stock)

    def test_ticker_symbol_can_contain_numbers(self):
        self.stock.ticker_symbol = '123'
        self._assert_stock_is_valid(self.stock)

    def test_ticker_symbol_can_contain_special_characters(self):
        self.stock.ticker_symbol = '_@*&'
        self._assert_stock_is_valid(self.stock)