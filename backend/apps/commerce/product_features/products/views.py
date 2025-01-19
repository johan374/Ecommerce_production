from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer
import traceback
import logging
from .pagination import StandardResultsSetPagination
import random

# Set up logging for the module
logger = logging.getLogger(__name__)

# View for featured products - uses basic APIView as it has custom logic
# This view handles featured products display using APIView instead of generic views
# because it implements custom logic for random selection
class FeaturedProductsView(APIView):
    # Allows anyone to access this endpoint without authentication
    # This means both logged-in and anonymous users can view featured products
    permission_classes = [permissions.AllowAny]
    
    # Handles GET requests to this endpoint
    def get(self, request):
        try:
            # Query the database for all products marked as featured
            # '-rating' means order by rating in descending order (highest first)
            all_featured_products = Product.objects.filter(
                is_featured=True
            ).order_by('-rating')
            
            # Limit the number of featured products to 12 maximum
            # If more than 12 exist, randomly select 12 to show
            # This helps keep the featured section fresh and dynamic
            if all_featured_products.count() > 12:
                # random.sample ensures we get unique items (no duplicates)
                featured_products = random.sample(list(all_featured_products), 12)
            else:
                # If 12 or fewer products, use all of them
                featured_products = all_featured_products
            
            # Convert the product objects to JSON format using ProductSerializer
            # many=True because we're serializing multiple products
            # context={'request': request} is included to help with generating 
            # absolute URLs for any hyperlinked fields in the serializer
            serializer = ProductSerializer(
                featured_products, 
                many=True, 
                context={'request': request} # This line provides request context # Passing the request
            )
            
            # Return the serialized data in a structured format
            # This specific structure matches what the frontend expects:
            # - 'data' contains the main payload
            # - 'results' contains the actual product data
            # - 'count' provides the total number of products returned
            return Response({
                'data': {
                    'results': serializer.data,
                    'count': len(featured_products)
                }
            })
            
        # Error handling block
        except Exception as e:
            # Log the error for debugging purposes
            # This writes to wherever the logger is configured to output
            logger.error(f"Error in FeaturedProductsView: {str(e)}")
            
            # Return a user-friendly error response
            # HTTP 500 indicates a server-side error
            return Response({
                'error': 'Unable to retrieve featured products'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Main product listing view with filtering and pagination
class ProductListView(generics.ListAPIView):
    # Gets all products from database as base queryset
    queryset = Product.objects.all()
    
    # Uses ProductSerializer to convert products to JSON
    serializer_class = ProductSerializer
    
    # Allows public access without authentication
    permission_classes = [permissions.AllowAny]
    
    # Uses pagination (e.g., 12 products per page)
    pagination_class = StandardResultsSetPagination

    # Sets up three types of filtering:
    filter_backends = [
        DjangoFilterBackend,     # For exact field matching (category='ELEC')
        filters.SearchFilter,     # For text search across fields
        filters.OrderingFilter   # For sorting results
    ]

    # Defines which fields can be used for exact filtering
    # Example URL: /api/products/?category=ELEC&is_featured=true
    filterset_fields = [
        'category',      # Filter by category
        'is_featured',   # Filter featured products
        'subcategory'    # Filter by subcategory
    ]

    # Defines which fields can be searched with text
    # Example URL: /api/products/?search=wireless+headphones
    search_fields = [
        'name',
        'description',
        'short_description'
    ]

    # Defines which fields can be used for sorting
    # Example URL: /api/products/?ordering=-price (descending price)
    ordering_fields = [
        'price',
        'rating',
        'created_at'
    ]

    # Custom method for price range filtering
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Get min and max price from URL parameters
        # Example URL: /api/products/?min_price=10&max_price=100
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        # Apply price filters if provided
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

# Detail view for single product
# This view handles requests for individual product details
# It inherits from RetrieveAPIView which is specifically designed for getting single objects
class ProductDetailView(generics.RetrieveAPIView):
    # Get all products as the base queryset
    # The specific product will be filtered using the URL parameter (usually ID)
    queryset = Product.objects.all()
    
    # Use ProductSerializer to convert the product object to JSON
    serializer_class = ProductSerializer
    
    # Allow any user to access this endpoint (no authentication required)
    permission_classes = [permissions.AllowAny]
    
    # Override the retrieve method to add custom error handling
    def retrieve(self, request, *args, **kwargs):
        try:
            # get_object() is provided by RetrieveAPIView
            # It automatically gets the product based on the URL parameter
            # For example: /api/products/123/ would get product with ID 123
            instance = self.get_object()
            
            # Serialize the product instance to JSON
            # context={'request': request} is needed for generating absolute URLs
            serializer = self.get_serializer(instance, context={'request': request})
            
            # Return the serialized product data
            return Response(serializer.data)

        # Handle the case where the product doesn't exist
        except Product.DoesNotExist:
            # Log a warning for monitoring/debugging
            # kwargs.get('pk') gets the ID from the URL
            logger.warning(f"Product not found with pk: {kwargs.get('pk')}")
            
            # Return a 404 response with a user-friendly error message
            return Response({
                'error': 'Product not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Handle any other unexpected errors
        except Exception as e:
            # Log the full error traceback for debugging
            logger.error(f"Error in ProductDetailView: {traceback.format_exc()}")
            
            # Return a 500 response with error details
            # The user gets a friendly message plus technical details
            return Response({
                'error': 'Unable to retrieve product details',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# This class handles advanced product searches with multiple filter options
# It inherits from ListAPIView which provides built-in functionality for listing objects
class ProductSearchView(generics.ListAPIView):
    # Get all products initially (this will be filtered later)
    queryset = Product.objects.all()
    
    # Use ProductSerializer to convert product objects to JSON
    serializer_class = ProductSerializer
    
    # Allow any user to access this endpoint (no login required)
    permission_classes = [permissions.AllowAny]
    
    # Use pagination to limit number of results per page
    pagination_class = StandardResultsSetPagination
    
    # Set up the filtering and ordering capabilities
    filter_backends = [
        filters.SearchFilter,      # Enables text-based search
        filters.OrderingFilter    # Enables sorting of results
    ]
    
    # Define which fields can be searched
    search_fields = [
        'name',                  # Search in product names
        'description',           # Search in full descriptions
        'short_description',     # Search in short descriptions
        'category'              # Search in category names
    ]
    
    # Define which fields can be used for sorting
    ordering_fields = [
        'price',                # Allow sorting by price
        'rating',               # Allow sorting by rating
        'created_at'           # Allow sorting by creation date
    ]
    
    # Override get_queryset to implement custom filtering logic
    def get_queryset(self):
        # Start with all products
        queryset = Product.objects.all()
        
        # Get search query from URL parameters (e.g., ?q=laptop)
        query = self.request.query_params.get('q', None)
        
        # If there's a search query, filter products
        if query:
            # Use Q objects to search across multiple fields with OR condition
            # This means the search term can match any of these fields
            queryset = queryset.filter(
                Q(name__icontains=query) |          # Match in name
                Q(description__icontains=query) |    # OR match in description
                Q(short_description__icontains=query) # OR match in short description
            )
        
        # Get price range parameters from URL
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        # Apply minimum price filter if provided
        if min_price:
            queryset = queryset.filter(price__gte=min_price)  # Greater than or equal to
        
        # Apply maximum price filter if provided
        if max_price:
            queryset = queryset.filter(price__lte=max_price)  # Less than or equal to
        
        # Get category parameter from URL
        category = self.request.query_params.get('category')
        
        # Apply category filter if provided
        if category:
            queryset = queryset.filter(category=category)
        
        # Return the filtered queryset
        return queryset
    
# This view handles listing products by category and supports filtering
# Inherits from ListAPIView which provides default GET method implementation
class ProductsByCategoryView(generics.ListAPIView):
   # Specifies which serializer to use for converting products to JSON
   serializer_class = ProductSerializer
   
   # Allow unrestricted access to this endpoint - no authentication needed
   permission_classes = [permissions.AllowAny]
   
   # Use pagination to limit number of results per page
   pagination_class = StandardResultsSetPagination
   
   # Override get_queryset to implement custom filtering logic
   def get_queryset(self):
       # Get category from URL parameter (e.g., 'ELEC' from /api/products/category/ELEC/)
       # self.kwargs contains URL parameters
       category = self.kwargs.get('category')
       
       # Start with base queryset filtered by category
       queryset = Product.objects.filter(category=category)
       
       # Get subcategory slug from query parameters (?slug=tv-home-theater)
       # self.request.query_params contains query string parameters
       subcategory_slug = self.request.query_params.get('slug')
       
       # If subcategory slug provided, filter products by subcategory
       # subcategory__slug uses Django's double underscore syntax to follow foreign key
       if subcategory_slug:
           queryset = queryset.filter(subcategory__slug=subcategory_slug)
       
       # Get price range parameters from query string
       # e.g., ?min_price=10&max_price=100
       min_price = self.request.query_params.get('min_price')
       max_price = self.request.query_params.get('max_price')
       
       # Apply minimum price filter if provided
       # price__gte means price Greater Than or Equal to
       if min_price:
           queryset = queryset.filter(price__gte=min_price)
           
       # Apply maximum price filter if provided
       # price__lte means price Less Than or Equal to
       if max_price:
           queryset = queryset.filter(price__lte=max_price)
       
       # Return the filtered queryset
       # Django will execute the actual database query when needed
       return queryset