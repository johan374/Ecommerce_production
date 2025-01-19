# Import the serializers module from Django REST Framework
# Serializers convert complex data (like model instances) to/from JSON
from rest_framework import serializers

# Import our NewsletterSubscriber model from the current directory's models.py
from .models import NewsletterSubscriber

# Create a serializer class that inherits from ModelSerializer
# ModelSerializer automatically creates fields based on the model
class NewsletterSerializer(serializers.ModelSerializer):
   # Meta class defines metadata for the serializer
   class Meta:
       # Specify which model this serializer is based on
       model = NewsletterSubscriber
       
       # List which fields should be included in the serialization
       # Here, we only want to expose the email field
       # Other fields (date_subscribed, is_active) will be hidden
       fields = ['email']