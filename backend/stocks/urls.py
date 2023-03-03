from django.urls import path
from .views import initiate_plaid_link, addAccount, listAccounts, get_access_token, get_balance,listTransactions, get_transaction,AddTransactions

urlpatterns = [
    path('initiate_plaid_link/', initiate_plaid_link),
    path('add_stock_account/', addAccount.as_view(), name='add_stock_account'),
    path('list_accounts/', listAccounts),
    path('get_access_token/', get_access_token),
    path('get_balance/', get_balance),
    path('get_transaction/', get_transaction),
    path('list_transactions/', listTransactions),
    path('add_transaction_account/', AddTransactions.as_view(), name='add_transaction_account'),
]