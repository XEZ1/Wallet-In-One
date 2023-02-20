from django.urls import path
from .views import initiate_plaid_link

urlpatterns = [
    path('initiate_plaid_link/', initiate_plaid_link)
]