from django.contrib import admin  # Import Django's admin module
from .models import Subcategory  # Import the Subcategory model we want to register

# @admin.register(Subcategory) is a decorator that registers this model with the admin site
# It's equivalent to calling admin.site.register(Subcategory, SubcategoryAdmin)
@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    # list_display defines which fields appear in the list view of subcategories
    # When you go to the subcategories list in admin, you'll see these columns
    list_display = ['name', 'category', 'slug', 'is_active']
    
    # list_filter adds filter options in the right sidebar
    # Users can filter subcategories by category and active status
    list_filter = ['category', 'is_active']
    
    # search_fields adds a search bar that looks through these fields
    # Admin users can search subcategories by name or description
    search_fields = ['name', 'description']
    
    # prepopulated_fields automatically generates the slug from the name field
    # As you type in the name field, the slug field updates automatically
    # Example: "Winter Clothes" becomes "winter-clothes"
    prepopulated_fields = {'slug': ('name',)}
    
    # ordering sets the default ordering of subcategories in the list view
    # First orders by category, then by name within each category
    ordering = ['category', 'name']