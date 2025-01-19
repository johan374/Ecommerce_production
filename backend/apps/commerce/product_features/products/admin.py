# Import necessary Django modules
from django import forms  # For creating custom forms and form fields
from django.contrib import admin  # Core Django admin functionality
from django.contrib.admin import SimpleListFilter  # For creating custom filters in admin
from django.utils.html import format_html  # For safely rendering HTML in admin
from .models import Product, ProductImage  # Import our models

# Custom filter for product prices in the admin interface
class PriceRangeFilter(SimpleListFilter):
    title = 'Price Range'  # Display name of the filter in admin sidebar
    parameter_name = 'price_range'  # URL parameter name for the filter
    
    def lookups(self, request, model_admin):
        # Define the filter options that will appear in admin
        # Returns tuples of (value, display_text)
        return (
            ('0-50', '$0 - $50'),      # First value is used in URL, second is displayed
            ('50-100', '$50 - $100'),
            ('100-500', '$100 - $500'),
            ('500-1000', '$500 - $1000'),  # Add more ranges
            ('1000+', '$1000+')
        )
    
    def queryset(self, request, queryset):
        # Filter the queryset based on the selected price range
        if self.value() == '0-50':
            return queryset.filter(price__range=[0, 50])  # Products between $0-$50
        elif self.value() == '50-100':
            return queryset.filter(price__range=[50, 100])
        elif self.value() == '100-500':
            return queryset.filter(price__range=[100, 500])
        elif self.value() == '500-1000':
            return queryset.filter(price__range=[100, 500])
        elif self.value() == '1000+':
            return queryset.filter(price__gte=1000)  # Products $500 and above
        return queryset  # Return unfiltered if no option selected

# Custom widget for handling multiple file uploads
class MultipleFileInput(forms.FileInput):
    def __init__(self, attrs=None):
        # Set HTML attribute for multiple file selection
        default_attrs = {'multiple': 'multiple'}
        if attrs:
            default_attrs.update(attrs)  # Merge with any custom attributes
        super().__init__(default_attrs)

# Custom field for handling multiple file uploads
class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        # Set our custom widget as default
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        # Handle validation for multiple files
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            # Clean each file individually if multiple files
            result = [single_file_clean(d, initial) for d in data]
        else:
            # Clean single file
            result = single_file_clean(data, initial)
        return result

# Inline admin interface for managing product images within product admin
class ProductImageInline(admin.TabularInline):
    model = ProductImage  # Use ProductImage model
    extra = 1  # Show one extra empty form
    fields = ['image', 'is_primary', 'alt_text']  # Fields to display

# Main Product admin configuration
@admin.register(Product)  # Register Product model with this admin class
class ProductAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = [
        'name',
        'category',
        'price',
        'display_image',  # Custom method to show thumbnail
        'rating',
        'is_featured',
        'created_at'
    ]
    
    # Filters shown in the right sidebar
    list_filter = [
        'category',
        'is_featured',
        ('created_at', admin.DateFieldListFilter),  # Built-in date filter
        PriceRangeFilter  # Our custom price filter
    ]
    
    # Fields that can be searched
    search_fields = [
        'name',
        'description',
        'short_description'
    ]
    
    ordering = ['-created_at']  # Default ordering (newest first)
    inlines = [ProductImageInline]  # Include inline image management
    
    # Group fields into sections in the edit form
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'subcategory', 'price')
        }),
        ('Descriptive Content', {
            'fields': ('description', 'short_description', 'meta_description')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Product Metrics', {
            'fields': ('rating', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Makes section collapsible
        })
    )
    
    # Fields that cannot be edited
    readonly_fields = ['created_at', 'updated_at']
    
    # Method to display image thumbnail in admin
    def display_image(self, obj):
        if obj.image:
            # Return HTML for image thumbnail using format_html for safe rendering
            return format_html(
                '<img src="{}" style="width: 100px; height: auto;" />',
                obj.image.url
            )
        return 'No Image'
    display_image.short_description = 'Image'  # Column header in admin

# ProductImage admin configuration
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    # Fields to show in list view
    list_display = ['product', 'display_image', 'is_primary', 'alt_text']
    # Filters in sidebar
    list_filter = ['is_primary', 'product__category']
    
    # Method to display image thumbnail
    def display_image(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto;" />',
                obj.image.url
            )
        return 'No Image'
    display_image.short_description = 'Image'