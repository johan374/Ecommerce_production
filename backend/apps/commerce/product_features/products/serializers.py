from rest_framework import serializers
from .models import Product, ProductImage
# In products/serializers.py
from apps.commerce.product_features.subcategories.serializers import SubcategorySerializer

# This class handles the serialization of ProductImage model instances into JSON format
# It inherits from ModelSerializer which provides default serialization behavior
class ProductImageSerializer(serializers.ModelSerializer):
    # Define a custom field that will be populated by the get_image_url method
    # SerializerMethodField() is used when we need custom logic to generate the field value
    image_url = serializers.SerializerMethodField()

    # Meta class defines metadata for the serializer
    class Meta:
        # Specify which model this serializer is working with
        model = ProductImage
        # List the fields that should be included in the serialized output
        # 'id': The primary key of the image
        # 'image_url': The computed URL for the image
        # 'is_primary': Boolean indicating if this is the main product image
        # 'alt_text': Alternative text for the image (for accessibility)
        fields = ['id', 'image_url', 'is_primary', 'alt_text']

    # Custom method to generate the full URL for the image
    # The method name must be 'get_<field_name>' for SerializerMethodField
    # obj parameter is the ProductImage instance being serialized
    def get_image_url(self, obj):
        try:
            # Get the request object from the serializer's context
            # Context is passed when the serializer is instantiated
            request = self.context.get('request')
            
            # After: Building absolute URLs
            # Check if both request and image exist
            if request and obj.image:
                # build_absolute_uri() creates a full URL including domain
                # Example: http://yourdomain.com/media/products/image.jpg
                url = request.build_absolute_uri(obj.image.url) # This gives full URL with domain
                print(f"Generated image URL: {url}")  # Debug logging
                return url
            
            # Return None if either request or image is missing
            return None
            
        except Exception as e:
            # Error handling with logging
            print(f"Error getting image URL for product image {obj.id}: {e}")
            return None

# Main product serializer
class ProductSerializer(serializers.ModelSerializer):
    # Custom fields that require special handling
    image_url = serializers.SerializerMethodField()  # For main product image
    additional_images = serializers.SerializerMethodField()  # For additional product images
    is_in_stock = serializers.SerializerMethodField()  # For stock status
    subcategory_details = SubcategorySerializer(source='subcategory', read_only=True)

    class Meta:
        model = Product  # Specifies the Product model for serialization
        fields = [
            # All fields that should be included in the API response
            'id', 'name',              # Basic product identification
            'category',                # Product categorization
            'subcategory',
            'subcategory_details',
            'price',                   # Product pricing
            'description',             # Full product description
            'short_description',       # Brief product description
            'meta_description',        # SEO description
            'image_url',              # Main product image URL
            'additional_images',       # Additional product images
            'rating',                 # Product rating
            'is_featured',            # Featured status
            'created_at',             # Creation timestamp
            'updated_at',             # Last update timestamp
            'is_in_stock'             # Stock availability
        ]

    # Method to get the main product image URL
    # In serializers.py, modify get_image_url
    def get_image_url(self, obj):
        try:
            if obj.image:
                request = self.context.get('request')
                if request:
                    url = request.build_absolute_uri(obj.image.url)
                    print(f"Built absolute URL: {url}")  # Debug log
                    return url
                return obj.image.url  # Return relative URL if no request
            return None
        except Exception as e:
            print(f"Error getting image URL: {str(e)}")
            return None

    # Method to get all additional product images
    def get_additional_images(self, obj):
        try:
            # Get all additional images for the product
            additional_images = obj.images.all()  # Use 'images' instead of get_additional_images()
            # Serialize them using ProductImageSerializer
            serializer = ProductImageSerializer(
                additional_images, 
                many=True,  # Indicates we're serializing multiple objects
                context=self.context  # Pass the context (contains request object)
            )
            return serializer.data
        except Exception as e:
            print(f"Error getting additional images for product {obj.id}: {e}")
            return []

    # Method to check product stock status
    def get_is_in_stock(self, obj):
        try:
            return obj.is_in_stock()  # Calls the model method to check stock
        except Exception as e:
            print(f"Error checking stock for product {obj.id}: {e}")
            return False