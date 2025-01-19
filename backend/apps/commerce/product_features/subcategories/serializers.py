# Import necessary Django REST Framework serializer tools
from rest_framework import serializers
# Import the Subcategory model to be serialized
from .models import Subcategory

class SubcategorySerializer(serializers.ModelSerializer):
    # Create a custom field that isn't directly in the model
    # SerializerMethodField allows you to add custom fields with a method
    products_count = serializers.SerializerMethodField()

    class Meta:
        # Specify which model this serializer is for
        model = Subcategory
        
        # Define which fields from the model should be included in the serialization
        # This determines what data will be sent in the API response
        fields = [
            'id',           # Unique identifier
            'name',         # Name of the subcategory
            'slug',         # URL-friendly version of the name
            'category',     # Category code (e.g., 'ELEC')
            'description', # Optional description
            'products_count' # Custom field we added
        ]

    # Custom method to get the count of products in this subcategory
    # The method name must start with 'get_' followed by the field name
    def get_products_count(self, obj):
        # obj is the Subcategory instance
        # Uses the related_name='products' we defined earlier
        # Filters only active products in this subcategory
        return obj.products.filter(is_active=True).count()