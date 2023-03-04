from django.urls import path

from .views import initiate_plaid_link, addAccount, listAccounts, get_access_token, get_balance,listTransactions, get_transactions,AddTransactions, get_stocks, deleteAccount, addStock
from .views import getTransaction

urlpatterns = [
    path('initiate_plaid_link/', initiate_plaid_link),
    path('add_stock_account/', addAccount.as_view(), name='add_stock_account'),
    path('list_accounts/', listAccounts),
    path('get_access_token/', get_access_token),
    path('get_balance/', get_balance),
    path('get_transactions/', get_transactions),
    path('list_transactions/<str:stock>/', listTransactions),
    path('add_transaction_account/', AddTransactions.as_view(), name='add_transaction_account'),
    path('get_stocks/', get_stocks),
    path('delete_account/', deleteAccount),
    path('get_transaction/<str:id>/', getTransaction),
    path('add_stock/', addStock.as_view(), name='add_stock')
]