# Import necessary modules
from django.db import IntegrityError  # For handling duplicate database entries
from rest_framework import status     # HTTP status codes (200, 201, 400, etc.)
from rest_framework.decorators import api_view, throttle_classes  # Decorators for API views
from rest_framework.response import Response  # For sending formatted API responses
from rest_framework.throttling import AnonRateThrottle  # Rate limiting for anonymous users
from .serializers import NewsletterSerializer  # Our custom serializer

# Define a custom rate throttle class
# This limits how often anonymous users can call this API
class NewsletterRateThrottle(AnonRateThrottle):
   rate = '3/hour'  # Limit to 3 requests per hour per user/IP

# Define the API view function
@api_view(['POST'])  # Only allow POST requests to this endpoint
@throttle_classes([NewsletterRateThrottle])  # Apply our rate limiting
def newsletter_subscribe(request):
   # Create a serializer instance with the POST data
   serializer = NewsletterSerializer(data=request.data)
   
   # Check if the data is valid
   if serializer.is_valid():
       try:
           # Try to save the new subscriber
           subscriber = serializer.save()
           
           # If successful, return a success response
           return Response({
               "message": "Successfully subscribed to newsletter",
               "email": subscriber.email,
               # Include a URL for redirecting to registration page
               "redirect_url": f"/register?email={subscriber.email}"
           }, status=status.HTTP_201_CREATED)  # 201 means resource created
           
       except IntegrityError:
           # Handle case where email already exists
           # This might happen due to race conditions
           return Response({
               "error": "This email is already subscribed",
               # Still provide redirect URL for existing email
               "redirect_url": f"/register?email={serializer.validated_data['email']}"
           }, status=status.HTTP_400_BAD_REQUEST)  # 400 means bad request
   
   # If data is invalid, return the validation errors
   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)