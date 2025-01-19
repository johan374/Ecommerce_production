# Import Django's admin module for creating admin interfaces
from django.contrib import admin
# Import our models that we want to manage in admin
from .models import Order, OrderItem, Payment

# Inline admin for OrderItems - this shows order items inside the Order view
# TabularInline displays items in a table format
class OrderItemInline(admin.TabularInline):
    model = OrderItem            # Which model to use for inline items
    extra = 0                    # Don't add empty forms for new items
    # Fields that can't be edited (view only)
    readonly_fields = ['product', 'quantity', 'price_cents']
    
    # Prevent deletion of order items for data integrity
    def has_delete_permission(self, request, obj=None):
        return False  # Never allow deletion of order items

# Register Order model with the admin site
# @admin.register(Order) is a decorator that does the registration
class OrderAdmin(admin.ModelAdmin):
    # Fields to display in the orders list
    list_display = [
        'order_number',          # Order reference number
        'status',               # Order status (PENDING, COMPLETED, etc.)
        'total_amount',         # Total amount of the order
        'created_at',          # When order was created
        'stripe_payment_intent_id'  # Stripe's reference
    ]
    
    # Add filters in the right sidebar
    list_filter = ['status', 'created_at']  # Filter by status and date
    
    # Fields that can be searched in the admin search bar
    search_fields = ['order_number', 'stripe_payment_intent_id']
    
    # Fields that can't be edited after creation
    readonly_fields = [
        'order_number',           # Can't change order number
        'total_amount_cents',     # Can't modify amount
        'stripe_payment_intent_id',  # Can't change Stripe reference
        'created_at',             # Can't change timestamps
        'updated_at'
    ]
    
    # Include the OrderItemInline we defined above
    inlines = [OrderItemInline]  # Show order items within order

# Register Payment model with the admin site
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    # Fields to show in payments list
    list_display = [
        'order',                # Link to related order
        'amount',               # Payment amount
        'status',              # Payment status
        'created_at',          # When payment was made
        'stripe_payment_intent_id'  # Stripe's reference
    ]
    
    # Add filters for payments
    list_filter = ['status', 'created_at']
    
    # Searchable fields - note order__order_number allows searching 
    # through related order's number
    search_fields = [
        'order__order_number',     # Search by order number # This means: look up 'order_number' through the 'order' relationship
        'stripe_payment_intent_id', # Search by Stripe payment ID
        'stripe_payment_method_id'  # Search by payment method
    ]
    
    # Fields that can't be edited
    readonly_fields = [
        'order',                # Can't change order
        'amount_cents',         # Can't modify amount
        'stripe_payment_intent_id',  # Can't change Stripe IDs
        'stripe_payment_method_id',
        'created_at',           # Can't change timestamps
        'updated_at'
    ]