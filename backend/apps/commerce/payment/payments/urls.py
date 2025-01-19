# Import path from django.urls to define URL patterns
from django.urls import path
# Import our three view classes from views.py
from .views import CreateOrderView, ProcessPaymentView, PaymentWebhookView

# Define URL patterns for our payment system
urlpatterns = [
    # URL pattern for creating new orders
    path('orders/create/', 
         CreateOrderView.as_view(),  # Convert class to view
         name='create-order'),       # Name for reverse URL lookup
    
    # URL pattern for processing payments after card entry
    path('process/', 
         ProcessPaymentView.as_view(), 
         name='process-payment'),
    
    # URL pattern for receiving Stripe webhook notifications
    path('webhook/', 
         PaymentWebhookView.as_view(), 
         name='stripe-webhook'),
]