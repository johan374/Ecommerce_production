# Import necessary Django REST Framework generic views
from rest_framework import generics
# Import permission class to control access
from rest_framework.permissions import IsAuthenticatedOrReadOnly
# Import for potential error handling
from django.core.exceptions import ValidationError
# Import the Subcategory model
from .models import Subcategory
# Import the serializer for Subcategory
from .serializers import SubcategorySerializer
# Import for search and filtering functionality
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

# View for listing and creating subcategories
class SubcategoryListView(generics.ListCreateAPIView):
    # Use SubcategorySerializer to convert model data to JSON
    serializer_class = SubcategorySerializer
    
    # Permission that allows:
    # - Anyone can view (list/retrieve)
    # - Only authenticated users can create/modify
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Enable search and filtering capabilities
    filter_backends = [
        filters.SearchFilter,     # Allows searching through fields
        DjangoFilterBackend       # Allows filtering by specific fields
    ]
    
    # Fields that can be searched
    search_fields = ['name', 'description']
    
    # Fields that can be filtered
    filterset_fields = ['category']

# View for detailed operations on a single subcategory
class SubcategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    # Only show active subcategories
    queryset = Subcategory.objects.filter(is_active=True)
    
    # Use SubcategorySerializer to convert model data to JSON
    serializer_class = SubcategorySerializer
    
    # Same permission as list view
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Use 'slug' instead of default 'pk' for lookup
    lookup_field = 'slug'

    # Custom method for delete operation
    def perform_destroy(self, instance):
        # Instead of hard deleting, mark as inactive
        # This is called a "soft delete"
        instance.is_active = False
        instance.save()