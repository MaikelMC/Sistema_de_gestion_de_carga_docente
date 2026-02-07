from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet, CommentReplyViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'replies', CommentReplyViewSet, basename='comment-reply')

urlpatterns = [
    path('', include(router.urls)),
]
