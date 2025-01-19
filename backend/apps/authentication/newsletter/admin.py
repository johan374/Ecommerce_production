# Import Django's admin module
from django.contrib import admin

# Import our NewsletterSubscriber model from models.py in the same directory
from .models import NewsletterSubscriber

# Register the model with the admin site using a decorator
# This is equivalent to admin.site.register(NewsletterSubscriber, NewsletterSubscriberAdmin)
@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
   # Define which fields to display in the list view
   # This will show three columns: email, date_subscribed, and is_active
   list_display = ['email', 'date_subscribed', 'is_active']
   
   # Add filter options in the right sidebar
   # Users can filter subscribers by:
   # - Active/Inactive status
   # - Subscription date
   list_filter = ['is_active', 'date_subscribed']
   
   # Enable search functionality
   # Admins can search subscribers by their email
   search_fields = ['email']
   
   # Add date-based drill-down navigation
   # Creates a date hierarchy navigation at the top
   # Can drill down by year -> month -> day
   date_hierarchy = 'date_subscribed'