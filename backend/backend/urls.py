from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import JsonResponse

# Create a view to show available endpoints
def api_root(request):
    return JsonResponse({
        'endpoints': {
            'products': {
                'featured': '/api/products/featured/',
                'list': '/api/products/',
                'search': '/api/products/search/',
                'by_category': '/api/products/category/<category>/',
                'detail': '/api/products/<id>/'
            },
            'subcategories': {
                'list': '/api/subcategories/',
                'by_category': '/api/subcategories/<category>/',
                'detail': '/api/subcategories/detail/<slug>/'
            },
            'newsletter': {
                'subscribe': '/api/newsletter/subscribe/'
            },
            'payments': {
                'create_order': '/api/orders/create/',
                'process': '/api/process/',
                'webhook': '/api/webhook/'
            }
        }
    })

# Main URL patterns
urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', api_root),
    path('api/products/', include('apps.commerce.product_features.products.urls')),
    path('api/subcategories/', include('apps.commerce.product_features.subcategories.urls')),
    path('api/newsletter/', include('apps.authentication.newsletter.urls')),
    path('api/', include('apps.commerce.payment.payments.urls')),
]

# Always serve media files regardless of DEBUG setting
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
        'show_indexes': True
    }),
]

# Handle static files
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# This ensures media files are always served, regardless of DEBUG setting
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)