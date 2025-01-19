# Import necessary Django and Python modules
from django.core.validators import (
    MinLengthValidator, MaxLengthValidator,
    FileExtensionValidator, MinValueValidator, MaxValueValidator
)
from django.db import models
from django.core.exceptions import ValidationError
from decimal import Decimal

class Product(models.Model):
    # Define choices for product categories using Django's TextChoices
    # This provides type safety and better organization than raw strings
    class CategoryChoices(models.TextChoices):
        ELECTRONICS = 'ELEC', 'Electronics'  # Database value, Display value
        FOOD = 'FOOD', 'Food'
    
    # Basic product information
    # CharField for product name with validation for length
    name = models.CharField(
        max_length=100,
        validators=[
            MinLengthValidator(2, "Product name must be at least 2 characters"),
            MaxLengthValidator(100, "Product name is too long")
        ]
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this product is active and should be displayed"
    )

    # Category field using predefined choices
    category = models.CharField(
        max_length=4,  # Length matches longest choice code ('ELEC')
        choices=CategoryChoices.choices,
        default=CategoryChoices.ELECTRONICS  
    )

    # ForeignKey Concept:
    # A ForeignKey is a database relationship that creates a link between two models.
    subcategory = models.ForeignKey(
        'subcategories.Subcategory',  # Reference to the Subcategory model
        on_delete=models.SET_NULL,    # What happens when the related subcategory is deleted
        null=True,                    # Allows the field to be null in the database
        blank=True,                   # Allows the field to be optional in forms
        related_name='products'       # Allows reverse relationship lookup
    )

    # Price field with decimal precision and validation
    price = models.DecimalField(
        max_digits=8,  # Total digits allowed (e.g., 999999.99)
        decimal_places=2,  # Cents precision
        validators=[
            MinValueValidator(Decimal('0.01')),  # Minimum price
            MaxValueValidator(Decimal('999999.99'))  # Maximum price
        ],
        default=Decimal('0.00')
    )

    # Product description fields with proper null/blank handling
    description = models.TextField(
        blank=True,  # Allow empty in forms
        null=True,   # Allow NULL in database
        default="",  # Default value
        validators=[MinLengthValidator(10)],
        help_text="Provide a detailed product description"
    )

    # Short description for listings/cards
    short_description = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        default="",
        help_text="Brief summary for listings"
    )

    # SEO metadata
    meta_description = models.CharField(
        max_length=160,  # Standard SEO meta description length
        blank=True,
        null=True,
        default="",
        help_text="SEO meta description"
    )

    # Define the validation method first
    def validate_image_size(image):
        """Validate that uploaded images don't exceed 5MB"""
        max_size = 5 * 1024 * 1024  # 5MB in bytes
        if image.size > max_size:
            raise ValidationError(f'Image size must not exceed 5MB. Current size is {image.size/1024/1024:.2f}MB')

    # Image field with validation
    image = models.ImageField(
        upload_to='products/%Y/%m/',  # Organize uploads by year/month
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp']),
            validate_image_size  # Custom size validator
        ],
        help_text="Upload product image (max 5MB, formats: jpg, png, webp)"
    )

    # Product metrics
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(0),  # Minimum rating
            MaxValueValidator(5)   # Maximum rating (5-star system)
        ]
    )
    
    # Boolean flag for featured products
    is_featured = models.BooleanField(default=False)
    
    # Automatic timestamps
    created_at = models.DateTimeField(auto_now_add=True)  # Set on creation
    updated_at = models.DateTimeField(auto_now=True)      # Updated on save

    # Custom validation method
    def clean(self):
        # Prevent description from being identical to name
        if self.description and self.description.lower() == self.name.lower():
            raise ValidationError("Description cannot be the same as product name")

    # Stock status method (placeholder)
    def is_in_stock(self):
        return True  # Implement actual stock logic here

    # Method to get related images
    def get_additional_images(self):
        return self.images.all()  # Use the related_name we defined

    # String representation of the model
    def __str__(self):
        return self.name

    # Meta options for the model
    class Meta:
        ordering = ['-created_at']  # Newest first
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

# Related model for product images
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        related_name='images',  # Add this for better querying
        on_delete=models.CASCADE
    )
    
    image = models.ImageField(
        upload_to='products/additional/%Y/%m/',
        verbose_name='Image'
    )
    
    is_primary = models.BooleanField(
        default=False,
        verbose_name='Is Primary Image'
    )
    
    alt_text = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        default="",
        help_text="Descriptive text for accessibility"
    )

    class Meta:
        ordering = ['is_primary']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name} ({'Primary' if self.is_primary else 'Secondary'})"

    def save(self, *args, **kwargs):
        # If this is marked as primary, ensure no other image is primary
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product, 
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)
        super().save(*args, **kwargs)