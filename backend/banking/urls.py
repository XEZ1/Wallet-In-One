from django.urls import path
from banking import views

urlpatterns = [
    path('bank_list/', views.bank_list, name='bank_list'),
    path('auth_page/<str:id>/', views.auth_page, name='auth_page'),
    path('finish_auth/', views.finish_auth, name='finish_auth'),
    path('user_accounts/<str:account_id>/', views.AccountList.as_view(), name='user_accounts'),
    path('user_accounts/', views.AccountList.as_view(), name='user_accounts'),
    path('transactions/<str:account_id>/', views.TransactionList.as_view(), name='transactions'),
    path('transactions/', views.TransactionList.as_view(), name='transactions'),
    path('delete_everything/', views.delete_everything, name='delete_everything'), # View only for debugging purposes
    path('get_total_balance/', views.get_total_balance, name='get_total_balance'),
]