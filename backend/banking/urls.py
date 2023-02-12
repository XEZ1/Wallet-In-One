from django.urls import path
from banking import views

urlpatterns = [
    path('bank_list/', views.bank_list, name='bank_list'),
    path('auth_page/<str:id>/', views.auth_page, name='auth_page'),
    path('finish_auth/', views.finish_auth, name='finish_auth'),
]