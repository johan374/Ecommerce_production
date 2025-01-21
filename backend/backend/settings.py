from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

# Project Paths and Environment
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()

# Security Configuration
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Host and CORS Configuration
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.render.com',
    'ecommerce-backend-nhrc.onrender.com',
]

CORS_CONFIG = {
    'ORIGINS': [
        'http://localhost:5173',
        'https://ecommerce-production-dc7d.onrender.com',
    ],
    'METHODS': ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    'HEADERS': [
        'accept', 'accept-encoding', 'authorization', 'content-type', 
        'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with'
    ]
}

CORS_ALLOWED_ORIGINS = CORS_CONFIG['ORIGINS']
CORS_ALLOW_METHODS = CORS_CONFIG['METHODS']
CORS_ALLOW_HEADERS = CORS_CONFIG['HEADERS']

# File Storage Configuration
STORAGE_CONFIG = {
    'STATIC': {
        'URL': '/static/',
        'ROOT': BASE_DIR / 'staticfiles',
        'STORAGE': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
    'MEDIA': {
        'URL': '/media/',
        'ROOT': BASE_DIR / 'media',
        'PERMISSIONS': 0o644,
        'DIR_PERMISSIONS': 0o755,
        'DEFAULT_STORAGE': 'django.core.files.storage.FileSystemStorage',
    },
    'SUPABASE': {
        'STORAGE_CLASS': 'storages.backends.s3boto3.S3Boto3Storage',
        'BUCKET_NAME': 'product-images-key',
        'ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
        'SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY'),
        'ENDPOINT_URL': os.getenv('AWS_S3_ENDPOINT_URL'),
    }
}

# Static and Media Files
STATIC_URL = STORAGE_CONFIG['STATIC']['URL']
STATIC_ROOT = STORAGE_CONFIG['STATIC']['ROOT']
STATICFILES_STORAGE = STORAGE_CONFIG['STATIC']['STORAGE']

MEDIA_URL = STORAGE_CONFIG['MEDIA']['URL']
MEDIA_ROOT = STORAGE_CONFIG['MEDIA']['ROOT']
FILE_UPLOAD_PERMISSIONS = STORAGE_CONFIG['MEDIA']['PERMISSIONS']
FILE_UPLOAD_DIRECTORY_PERMISSIONS = STORAGE_CONFIG['MEDIA']['DIR_PERMISSIONS']
DEFAULT_FILE_STORAGE = STORAGE_CONFIG['MEDIA']['DEFAULT_STORAGE']

# Supabase Storage Configuration
DEFAULT_FILE_STORAGE = STORAGE_CONFIG['SUPABASE']['STORAGE_CLASS']
AWS_ACCESS_KEY_ID = STORAGE_CONFIG['SUPABASE']['ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = STORAGE_CONFIG['SUPABASE']['SECRET_ACCESS_KEY']
AWS_STORAGE_BUCKET_NAME = STORAGE_CONFIG['SUPABASE']['BUCKET_NAME']
AWS_S3_ENDPOINT_URL = STORAGE_CONFIG['SUPABASE']['ENDPOINT_URL']

# Additional S3-compatible Storage Settings
AWS_S3_REGION_NAME = ''
AWS_S3_ADDRESSING_STYLE = 'path'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False
AWS_S3_FILE_OVERWRITE = False

# Security Settings
SECURITY_CONFIG = {
    'TRUSTED_ORIGINS': [
        'http://localhost:5173',
        'https://ecommerce-production-dc7d.onrender.com',
    ],
    'SSL_REDIRECT': True,
    'COOKIE_SECURE': True,
    'XSS_PROTECTION': True,
    'CONTENT_TYPE_NOSNIFF': True
}

CSRF_TRUSTED_ORIGINS = SECURITY_CONFIG['TRUSTED_ORIGINS']
SECURE_SSL_REDIRECT = SECURITY_CONFIG['SSL_REDIRECT']
SESSION_COOKIE_SECURE = SECURITY_CONFIG['COOKIE_SECURE']
CSRF_COOKIE_SECURE = SECURITY_CONFIG['COOKIE_SECURE']
SECURE_BROWSER_XSS_FILTER = SECURITY_CONFIG['XSS_PROTECTION']
SECURE_CONTENT_TYPE_NOSNIFF = SECURITY_CONFIG['CONTENT_TYPE_NOSNIFF']

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny']
}

# Application Configuration
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'mptt',
    'django_filters',
]

LOCAL_APPS = [
    'apps.commerce.product_features.products.apps.ProductsConfig',
    'apps.commerce.product_features.subcategories.apps.SubcategoriesConfig',
    'apps.commerce.payment.payments',
    'apps.authentication.newsletter.apps.NewsletterConfig',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Middleware Configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Whitenoise Configuration
WHITENOISE_CONFIG = {
    'USE_FINDERS': True,
    'MANIFEST_STRICT': False,
    'ALLOW_ALL_ORIGINS': True
}

WHITENOISE_USE_FINDERS = WHITENOISE_CONFIG['USE_FINDERS']
WHITENOISE_MANIFEST_STRICT = WHITENOISE_CONFIG['MANIFEST_STRICT']
WHITENOISE_ALLOW_ALL_ORIGINS = WHITENOISE_CONFIG['ALLOW_ALL_ORIGINS']

# URL and Template Configuration
ROOT_URLCONF = 'backend.urls'
WSGI_APPLICATION = 'backend.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database Configuration
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True
    )
}

# Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Payment Gateway Configuration
PAYMENT_CONFIG = {
    'STRIPE_SECRET_KEY': os.getenv('STRIPE_SECRET_KEY'),
    'STRIPE_PUBLISHABLE_KEY': os.getenv('STRIPE_PUBLISHABLE_KEY'),
    'STRIPE_WEBHOOK_SECRET': os.getenv('STRIPE_WEBHOOK_SECRET')
}

STRIPE_SECRET_KEY = PAYMENT_CONFIG['STRIPE_SECRET_KEY']
STRIPE_PUBLISHABLE_KEY = PAYMENT_CONFIG['STRIPE_PUBLISHABLE_KEY']
STRIPE_WEBHOOK_SECRET = PAYMENT_CONFIG['STRIPE_WEBHOOK_SECRET']