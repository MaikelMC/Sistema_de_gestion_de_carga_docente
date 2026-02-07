from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FacultyViewSet, DisciplineViewSet, SubjectViewSet

router = DefaultRouter()
router.register(r'faculties', FacultyViewSet, basename='faculty')
router.register(r'disciplines', DisciplineViewSet, basename='discipline')
router.register(r'subjects', SubjectViewSet, basename='subject')

urlpatterns = [
    path('', include(router.urls)),
]
