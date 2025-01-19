from django.urls import path
from .views import (
    FeaturedProductsView,
    ProductListView,
    ProductDetailView,
    ProductSearchView,
    ProductsByCategoryView
)

# urls.py

urlpatterns = [
    # Featured products endpoint
    # URL: /api/products/featured/
    # No parameters needed - just shows featured products
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    
    # Main product list endpoint
    # URL: /api/products/
    # Empty string means this is the root/base URL for products
    path('', ProductListView.as_view(), name='product-list'),
    
    # Product search endpoint
    # URL: /api/products/search/
    # Handles search queries via query parameters (?q=search_term)
    path('search/', ProductSearchView.as_view(), name='product-search'),
    
    # Individual product detail endpoint
    # URL: /api/products/1/ or /api/products/42/
    # <int:pk> explained:
    # - int: Converter that only matches integer numbers
    # - pk: Parameter name (primary key) that will be passed to the view
    # - Together they ensure URLs like /products/abc/ won't match
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Category endpoint
    # URL: /api/products/category/FOOD/ or /api/products/category/ELECTRONICS/
    # <str:category> explained:
    # - str: Converter that matches any string
    # - category: Parameter name that will be passed to the view
    # - Allows dynamic category names in the URL
    path('category/<str:category>/', ProductsByCategoryView.as_view(), name='products-by-category'),
]

"""
Path converters explained:

1. <int:pk>
   - int is a path converter that only matches digits
   - pk is the name of the parameter passed to your view
   - Common use: For database IDs and primary keys
   - Example: /products/123/ -> pk will be 123
   - Won't match: /products/abc/

2. <str:category>
   - str is a path converter that matches any string except '/'
   - category is the name of the parameter passed to your view
   - Common use: For names, slugs, or identifiers
   - Example: /category/FOOD/ -> category will be "FOOD"
   - Will match: /category/any-text-here/

Other available path converters:
- slug: Matches slug strings (letters, numbers, hyphens, underscores)
- uuid: Matches UUID strings
- path: Matches any string including '/'

The angle brackets <> are Django's syntax for capturing URL parts as variables
"""