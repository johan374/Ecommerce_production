# Import necessary models
from django.db import models
from apps.commerce.product_features.products.models import Product

class Subcategory(models.Model):
    # Name of the subcategory (e.g., "TV & Home Theater")
    # max_length=100 means it can be up to 100 characters long
    name = models.CharField(max_length=100)

    # Slug is a URL-friendly version of the name by converting special characters and spaces into hyphens "-" .
    # unique=True ensures no two subcategories have the same slug
    # Example: "tv-home-theater"
    slug = models.SlugField(unique=True)

    # Category field that uses choices from the Product model
    # max_length=4 matches the length of category codes in Product model
    # choices=Product.CategoryChoices.choices links to the predefined categories in Product
    # This ensures subcategories can only be created for existing product categories
    category = models.CharField(
        max_length=4,
        choices=Product.CategoryChoices.choices
    )

    # Optional description field
    # blank=True allows the field to be empty
    description = models.TextField(blank=True)

    # Boolean to quickly enable/disable a subcategory
    # default=True means new subcategories are active by default
    is_active = models.BooleanField(default=True)

    # Automatic timestamp for creation
    # auto_now_add=True sets the time when the record is first created
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatic timestamp for last update
    # auto_now=True updates the time each time the record is saved
    updated_at = models.DateTimeField(auto_now=True)

    # Meta class for model-specific options
    class Meta:
        # Correct plural name in admin interface
        verbose_name_plural = 'Subcategories'

        # Default ordering when retrieving subcategories
        # Django will automatically sort the results alphabetically by name
        ordering = ['name']

        # Ensures no duplicate slugs within the same category
        # Example: You can have a 'tv-home-theater' in ELEC and FOOD, but not two in ELEC
        unique_together = ['category', 'slug']

        # Database index for faster querying
        # Helps in quickly finding subcategories by category and slug
        #so it only create a records and save it and the databse use it this record instead of looking page by page
        indexes = [
            models.Index(fields=['category', 'slug'])
        ]

    # String representation of the model
    # Used in admin interface and debugging
    # get_category_display() shows the full category name
    #__str__ is a special Python method that defines how an object should be represented as a string
    # self.name returns the name of the subcategory (e.g., "TV & Home Theater")
    #self.get_category_display() is a Django method that:
    # Converts the category code to its human-readable name
    # For example, 'ELEC' becomes 'Electronics'
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"