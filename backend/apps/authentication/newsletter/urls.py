from django.urls import path
from . import views

app_name = 'newsletter'

urlpatterns = [
    path('api/newsletter/subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
]