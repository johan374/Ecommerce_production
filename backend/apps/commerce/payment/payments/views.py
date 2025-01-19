# apps/commerce/payment/payments/views.py
# Import necessary modules from Django REST framework for API creation
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
# Import Django settings to access Stripe keys
from django.conf import settings
# Import our models and serializers
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, PaymentSerializer
# Import Stripe for payment processing
import stripe
# Import uuid for generating unique order numbers
import uuid

# Set up Stripe with our secret key from Django settings
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateOrderView(APIView):
    def post(self, request):
        try:
            # Generate a unique order number
            # uuid.uuid4() creates a random UUID
            # "hex[:8] takes first 8 characters
            # .hex converts it to a 32-character hexadecimal string
            # [:8] takes just the first 8 characters" 
            # upper() converts to uppercase
            # Result example: "ORD-1A2B3C4D"
            #The "ORD-" prefix makes it immediately clear it's an order number, and the 8 random characters after make it unique. 
            order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            
            # Get the items array from the request data
            # If no items found, default to empty list []
            items = request.data.get('items', [])
            
            # Calculate the total amount in cents
            # Example: 2 items at $29.99 each = 5998 cents
            total_amount_cents = sum(
                item.get('price_cents', 0) * item.get('quantity', 0) 
                for item in items
            )
            
            # Create a PaymentIntent in Stripe
            # This is Stripe's way of tracking a payment
            payment_intent = stripe.PaymentIntent.create(
                amount=total_amount_cents,          # Amount to charge
                currency='usd',                     # Currency to use
                automatic_payment_methods={
                    'enabled': True                 # Allow any payment method
                },
                metadata={
                    'order_number': order_number    # Add our reference # We can find this later
                }
            )
            
            # Create the order in our database
            order = Order.objects.create(
                order_number=order_number,          # Our unique reference
                total_amount_cents=total_amount_cents,  # Total in cents
                stripe_payment_intent_id=payment_intent.id  # Stripe's reference
            )
            
            # Create individual order items
            # Each item in the order is saved separately
            for item in items:
                OrderItem.objects.create(
                    order=order,                # Link to parent order
                    product_id=item['product_id'],  # Which product
                    quantity=item['quantity'],      # How many
                    price_cents=item['price_cents'] # Price per item
                )
            
            # Prepare the response
            # Serialize the order for the API response
            serializer = OrderSerializer(order)
            # Return both order data and Stripe's client_secret
            # client_secret is needed by frontend to complete payment
            return Response({
                'order': serializer.data,
                'client_secret': payment_intent.client_secret
            }, status=status.HTTP_201_CREATED)  # 201 = Created successfully
            
        # Handle Stripe-specific errors
        except stripe.error.StripeError as e:
            return Response({
                'error': 'Payment service error',
                'details': str(e)
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)  # 503 = Service unavailable
        
        # Handle any other errors
        except Exception as e:
            return Response({
                'error': 'Unable to create order',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)  # 400 = Bad request
        
# First Class: Handles processing payments after customer enters card details
class ProcessPaymentView(APIView):
    def post(self, request):
        try:
            # Get Stripe's payment IDs from the request
            payment_intent_id = request.data.get('payment_intent_id')   # ID of the payment attempt
            payment_method_id = request.data.get('payment_method_id')   # ID of the card/payment method
            
            # Check with Stripe if payment was successful
            # This gets the current status of the payment
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            # Find our order using Stripe's payment ID
            # This links Stripe's payment to our order
            order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
            
            # Create a record of the payment in our database
            payment = Payment.objects.create(
                order=order,                    # Link to our order
                amount_cents=payment_intent.amount,  # Amount from Stripe
                stripe_payment_intent_id=payment_intent_id,  # Stripe's payment ID
                stripe_payment_method_id=payment_method_id,  # Card/payment method ID
                # Set status based on Stripe's response
                status='COMPLETED' if payment_intent.status == 'succeeded' else 'FAILED'
            )
            
            # Update the order's status based on payment result
            order.status = 'COMPLETED' if payment_intent.status == 'succeeded' else 'FAILED'
            order.save()
            
            # Return the payment details
            serializer = PaymentSerializer(payment)
            return Response(serializer.data)
            
        # Handle case where order isn't found
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        # Handle Stripe-specific errors
        except stripe.error.StripeError as e:
            return Response({
                'error': 'Payment processing failed',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

# Second Class: Handles automatic updates from Stripe (webhook notifications)
class PaymentWebhookView(APIView):
    def post(self, request):
        # Get the raw data sent by Stripe
        payload = request.body
        # Get Stripe's signature from headers
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE') # Security signature
        
        try:
            # Verify this is really from Stripe
            # Uses our webhook secret to validate the signature
            event = stripe.Webhook.construct_event(
                payload,                         # The raw data from the request
                sig_header,                      # Stripe's signature
                settings.STRIPE_WEBHOOK_SECRET   # Our secret key shared with Stripe
            )
            
            # Handle different types of events from Stripe
            if event.type == 'payment_intent.succeeded':
                # Payment was successful
                payment_intent = event.data.object
                 # Use Stripe's payment ID to find our order
                order = Order.objects.get(stripe_payment_intent_id=payment_intent.id)
                order.status = 'COMPLETED'
                order.save()
                
            elif event.type == 'payment_intent.payment_failed':
                # Payment failed
                payment_intent = event.data.object
                # Find and update our order
                order = Order.objects.get(stripe_payment_intent_id=payment_intent.id)
                order.status = 'FAILED'
                order.save()
                
            # Tell Stripe we received their notification
            return Response({'status': 'success'})
            
        # Handle webhook validation errors
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            return Response(
                {'error': 'Invalid payload or signature'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Handle any other errors
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        