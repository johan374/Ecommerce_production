# Import the models module from Django's database utilities
from django.db import models

# Define a model class for newsletter subscribers that inherits from Django's base Model class
class NewsletterSubscriber(models.Model):
   # Email field with unique constraint - no duplicate emails allowed
   # EmailField automatically validates proper email format
   email = models.EmailField(unique=True)

   # Automatically set the date when a subscriber is created
   # auto_now_add=True means it's set only when first created
   date_subscribed = models.DateTimeField(auto_now_add=True)

   # Boolean field to track if the subscription is active
   # default=True means new subscribers start as active
   is_active = models.BooleanField(default=True)

   # Meta class defines model-specific settings
   class Meta:
       # Order subscribers by subscription date, newest first
       # The '-' prefix means descending order
       ordering = ['-date_subscribed']
       
       # How the model should be displayed in Django admin
       # Single form name
       verbose_name = 'Newsletter Subscriber'
       # Plural form name
       verbose_name_plural = 'Newsletter Subscribers'

   # String representation of the model
   # When you print() an instance, it will show the email
   # Also used in Django admin interface
   def __str__(self):
       return self.email