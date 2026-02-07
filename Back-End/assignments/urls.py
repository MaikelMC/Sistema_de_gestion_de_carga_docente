from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AssignmentViewSet, AssignmentHistoryViewSet

router = DefaultRouter()
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'history', AssignmentHistoryViewSet, basename='assignment-history')

urlpatterns = [
    path('', include(router.urls)),
]
