from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('apps.commerce.product_features.products.urls')),
    path('api/subcategories/', include('apps.commerce.product_features.subcategories.urls')),
    path('api/newsletter/', include('apps.authentication.newsletter.urls')),
    path('api/', include('apps.commerce.payment.payments.urls')),

    # Media file serving for all environments
    re_path(r'^media/(?P<path>.*)$', serve, {
        'document_root': settings.MEDIA_ROOT,
    }),
]

# Add static/media serving for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)