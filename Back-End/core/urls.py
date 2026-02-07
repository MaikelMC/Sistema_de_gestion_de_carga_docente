"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)


def home_redirect(request):
    """Redirigir la raíz a la documentación Swagger."""
    return redirect('/api/docs/')


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Vista raíz de la API."""
    return Response({
        'message': 'Sistema de Gestión de Carga Docente - API',
        'version': '1.0.0',
        'documentation': {
            'swagger': '/api/docs/',
            'redoc': '/api/redoc/',
            'schema': '/api/schema/',
        },
        'endpoints': {
            'auth': '/api/auth/',
            'users': '/api/users/',
            'academic': '/api/academic/',
            'professors': '/api/professors/',
            'assignments': '/api/assignments/',
            'comments': '/api/comments/',
        }
    })


urlpatterns = [
    # Redirección de la raíz a Swagger
    path('', home_redirect, name='home'),
    
    path('admin/', admin.site.urls),
    
    # API Documentation (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Root
    path('api/', api_root, name='api-root'),
    
    # API Endpoints
    path('api/', include('users.urls')),
    path('api/academic/', include('academic.urls')),
    path('api/', include('professors.urls')),
    path('api/', include('assignments.urls')),
    path('api/', include('comments.urls')),
]

# Servir archivos estáticos y media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
