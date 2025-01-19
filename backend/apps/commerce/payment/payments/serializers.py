# Import the serializers module from Django REST framework
from rest_framework import serializers
# Import our models that we want to serialize
from .models import Order, OrderItem, Payment

# Serializer for individual items in an order
class OrderItemSerializer(serializers.ModelSerializer):
    # Define how we want to handle the price in dollars (for display)
    # read_only=True means this field is only for sending to the client, not receiving
    price = serializers.DecimalField(
        max_digits=10,        # Maximum number of total digits
        decimal_places=2,     # Show 2 decimal places for cents
        read_only=True        # Can't be modified through API
    )
    
    # Define how we handle the price in cents (for storage)
    # write_only=True means this field is only for receiving from the client
    price_cents = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem  # Specify which model to serialize
        # List all fields that should be included in the API
        fields = [
            'id',           # Database ID
            'product',      # Reference to the product
            'quantity',     # How many items ordered
            'price',        # Price in dollars (for display)
            'price_cents'   # Price in cents (for storage)
        ]

# Serializer for the main order
class OrderSerializer(serializers.ModelSerializer):
    # Include all items in this order
    # many=True because an order can have multiple items
    # read_only=True because items are managed separately
    items = OrderItemSerializer(many=True, read_only=True)
    
    # Total amount in dollars (for display)
    total_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    
    # Total amount in cents (for storage/Stripe)
    total_amount_cents = serializers.IntegerField()

    class Meta:
        model = Order
        # List all fields that should be included in the API
        fields = [
            'id',                      # Database ID
            'order_number',            # Our custom order number
            'status',                  # Order status
            'total_amount',            # Amount in dollars
            'total_amount_cents',      # Amount in cents
            'items',                   # All items in the order
            'created_at',              # When order was created
            'stripe_payment_intent_id' # Stripe's reference ID
        ]
        # Fields that can't be modified through the API
        read_only_fields = ['stripe_payment_intent_id']

# Serializer for payment transactions
class PaymentSerializer(serializers.ModelSerializer):
    # Amount in dollars (for display)
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = Payment
        # List all fields that should be included in the API
        fields = [
            'id',                       # Database ID
            'order',                    # Reference to the order
            'amount',                   # Amount in dollars
            'amount_cents',             # Amount in cents
            'status',                   # Payment status
            'stripe_payment_intent_id',  # Stripe's payment reference
            'stripe_payment_method_id',  # Stripe's payment method
            'created_at'                # When payment was created
        ]
        # Fields that can't be modified through the API
        read_only_fields = ['stripe_payment_intent_id']