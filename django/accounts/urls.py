from django.urls import path
from .views import sign_up


urlpatterns = [
    path('sign_up/', sign_up.as_view(), name='sign_up'),
]