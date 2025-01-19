# apps/commerce/payment/payments/models.py
# Import necessary Django modules and the Product model
from django.db import models
from django.core.validators import MinValueValidator  # For validating minimum values
from apps.commerce.product_features.products.models import Product  # Our existing Product model

# Order model - represents a customer's order
class Order(models.Model):
    # Define possible status values for an order
    # Using a list of tuples: (database_value, display_value)
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),      # Order created but not paid
        ('PROCESSING', 'Processing'), # Payment received, being prepared
        ('COMPLETED', 'Completed'),   # Order fulfilled
        ('FAILED', 'Failed'),        # Payment or processing failed
        ('REFUNDED', 'Refunded')     # Money returned to customer
    ]

    # Unique identifier for the order (e.g., "ORD-12345")
    order_number = models.CharField(max_length=50, unique=True)
    
    # Current status of the order, defaults to 'PENDING'
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING'
    )
    
    # Total amount stored in cents/pennies (e.g., $10.99 stored as 1099)
    # Stripe requires amounts in smallest currency unit (cents for USD)
    total_amount_cents = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]  # Ensures amount is at least 1 cent
    )
    
    # Stripe's unique identifier for this payment transaction
    # null=True and blank=True allow this field to be empty
    stripe_payment_intent_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Automatic timestamps
    created_at = models.DateTimeField(auto_now_add=True)  # Set when order is created
    updated_at = models.DateTimeField(auto_now=True)      # Updated on any change

    # Property to convert cents to dollars for display
    @property
    def total_amount(self):
        """Convert cents to dollars for display"""
        return self.total_amount_cents / 100  # e.g., 1099 cents → $10.99

    # String representation of the order
    def __str__(self):
        return f"Order {self.order_number} - {self.status}"

# OrderItem model - represents individual items within an order
class OrderItem(models.Model):
    # Link to the parent order
    # CASCADE means if order is deleted, delete its items too
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    
    # Link to the product being ordered
    # SET_NULL means if product is deleted, keep the order item but set product to NULL
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # Quantity of items ordered
    quantity = models.PositiveIntegerField(default=1)
    
    # Price in cents (Stripe format)
    # Stored separately from product price in case product price changes later
    price_cents = models.PositiveIntegerField()
    
    # Property to show price in dollars
    @property
    def price(self):
        """Convert cents to dollars for display"""
        return self.price_cents / 100
    
    # Property to calculate total for this line item
    @property
    def subtotal_cents(self):
        """Calculate subtotal in cents"""
        return self.price_cents * self.quantity
    
    # String representation of the order item
    def __str__(self):
        return f"{self.quantity}x {self.product.name if self.product else 'Deleted Product'}"

# Payment model - represents payment transactions
class Payment(models.Model):
    # Possible payment status values
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),     # Payment initiated
        ('COMPLETED', 'Completed'), # Payment successful
        ('FAILED', 'Failed'),      # Payment failed
        ('REFUNDED', 'Refunded')   # Payment refunded
    ]

    # Link to the order being paid for
    order = models.ForeignKey(Order, related_name='payments', on_delete=models.CASCADE)
    
    # Amount in cents (Stripe format)
    amount_cents = models.PositiveIntegerField()
    
    # Current payment status
    status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default='PENDING'
    )
    
    # Stripe-specific identifiers
    stripe_payment_intent_id = models.CharField(max_length=255)  # Stripe's payment intent ID
    stripe_payment_method_id = models.CharField(max_length=255)  # Stripe's payment method ID
    
    # Automatic timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Property to show amount in dollars
    @property
    def amount(self):
        """Convert cents to dollars for display"""
        return self.amount_cents / 100
    
    # String representation of the payment
    def __str__(self):
        return f"Payment {self.stripe_payment_intent_id} for Order {self.order.order_number}"