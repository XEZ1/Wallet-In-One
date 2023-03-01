from django.urls import path
from .views import initiate_plaid_link, addAccount, listAccounts, get_access_token, get_balance, get_stocks, deleteAccount

urlpatterns = [
    path('initiate_plaid_link/', initiate_plaid_link),
    path('add_stock_account/', addAccount.as_view(), name='add_stock_account'),
    path('list_accounts/', listAccounts),
    path('get_access_token/', get_access_token),
    path('get_balance/', get_balance),
    path('get_stocks/', get_stocks),
    path('delete_account/', deleteAccount)
]