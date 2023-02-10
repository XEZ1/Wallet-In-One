from django.urls import path
from banking import views

urlpatterns = [
    path('bank_list', views.bank_list, name='bank_list'),
]