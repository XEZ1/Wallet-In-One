from django.urls import path
from .views import initiate_plaid_link, addAccount, listAccounts

urlpatterns = [
    path('initiate_plaid_link/', initiate_plaid_link),
    path('add_stock_account/', addAccount.as_view(), name='add_stock_account'),
    path('list_accounts/', listAccounts)
]