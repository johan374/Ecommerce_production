# Import necessary Django URL routing tools
from django.urls import path
# Import the view classes that will handle different URL patterns
from .views import SubcategoryListView, SubcategoryDetailView

# Set the namespace for these URLs
# Helps avoid naming conflicts in larger projects
app_name = 'subcategories'

# Define URL patterns for subcategory-related views
urlpatterns = [
    # URL pattern for listing all subcategories
    # Matches: /api/subcategories/
    path('', SubcategoryListView.as_view(), name='subcategory-list'),
    
    # URL pattern for listing subcategories by category
    # Matches: /api/subcategories/ELEC/
    # <str:category> captures the category as a string parameter
    path('<str:category>/', SubcategoryListView.as_view(), name='category-subcategories'),
    
    # URL pattern for getting details of a specific subcategory
    # Matches: /api/subcategories/detail/tv-home-theater/
    # <str:slug> captures the unique slug of the subcategory
    path('detail/<str:slug>/', SubcategoryDetailView.as_view(), name='subcategory-detail'),
]