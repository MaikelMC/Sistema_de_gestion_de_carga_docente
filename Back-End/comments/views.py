from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Comment, CommentReply
from .serializers import (
    CommentSerializer, CommentCreateSerializer, CommentListSerializer,
    CommentReplySerializer
)
from users.permissions import IsNotBlocked, CanViewComments, CanModifyAssignments


@extend_schema_view(
    list=extend_schema(
        summary="Listar comentarios",
        description="Obtiene la lista de comentarios. Los jefes ven solo sus propios comentarios, director y vicedecano ven todos.",
        tags=['Comments']
    ),
    retrieve=extend_schema(
        summary="Detalle de comentario",
        description="Obtiene el detalle de un comentario específico.",
        tags=['Comments']
    ),
    create=extend_schema(
        summary="Crear comentario",
        description="Crea un nuevo comentario. Solo jefes y vicedecano pueden crear comentarios.",
        tags=['Comments']
    ),
    update=extend_schema(
        summary="Actualizar comentario",
        description="Actualiza un comentario existente.",
        tags=['Comments']
    ),
    partial_update=extend_schema(
        summary="Actualizar parcialmente comentario",
        description="Actualiza parcialmente un comentario existente.",
        tags=['Comments']
    ),
    destroy=extend_schema(
        summary="Eliminar comentario",
        description="Elimina un comentario del sistema.",
        tags=['Comments']
    )
)
class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Comentarios.
    """
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_read', 'comment_type', 'author']
    search_fields = ['subject', 'message']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        elif self.action == 'list':
            return CommentListSerializer
        return CommentSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            # Jefes, vicedecano, y admin pueden crear comentarios
            self.permission_classes = [IsAuthenticated, IsNotBlocked]
        elif self.action in ['list', 'retrieve']:
            # Todos los usuarios autenticados pueden ver comentarios
            self.permission_classes = [IsAuthenticated, IsNotBlocked]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Comment.objects.select_related(
            'author', 'assignment', 'read_by'
        ).prefetch_related('replies').all()
        
        return queryset
    
    @extend_schema(
        summary="Marcar como leído",
        description="Marca un comentario como leído por el usuario actual.",
        tags=['Comments']
    )
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marcar comentario como leído."""
        comment = self.get_object()
        
        if not request.user.can_view_comments():
            return Response(
                {'error': 'No tiene permisos para marcar comentarios como leídos.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        comment.mark_as_read(request.user)
        return Response({'message': 'Comentario marcado como leído.'})
    
    @extend_schema(
        summary="Responder comentario",
        description="Agrega una respuesta a un comentario existente.",
        tags=['Comments'],
        request=CommentReplySerializer,
        responses={201: CommentReplySerializer}
    )
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Responder a un comentario."""
        comment = self.get_object()
        
        if not request.user.can_view_comments():
            return Response(
                {'error': 'No tiene permisos para responder comentarios.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = CommentReplySerializer(
            data={'comment': comment.id, 'message': request.data.get('message')},
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Comentarios no leídos",
        description="Obtiene la lista de comentarios que no han sido leídos.",
        tags=['Comments'],
        responses={200: CommentListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Obtener comentarios no leídos."""
        if not request.user.can_view_comments():
            return Response(
                {'error': 'No tiene permisos para ver comentarios.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset().filter(is_read=False)
        serializer = CommentListSerializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    @extend_schema(
        summary="Estadísticas de comentarios",
        description="Obtiene estadísticas generales de comentarios: total, leídos, no leídos y por tipo.",
        tags=['Comments']
    )
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Obtener estadísticas de comentarios."""
        if not request.user.can_view_comments():
            return Response(
                {'error': 'No tiene permisos para ver estadísticas.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        total = queryset.count()
        unread = queryset.filter(is_read=False).count()
        
        # Por tipo
        by_type = {}
        for choice in Comment.CommentType.choices:
            by_type[choice[1]] = queryset.filter(comment_type=choice[0]).count()
        
        return Response({
            'total': total,
            'unread': unread,
            'read': total - unread,
            'by_type': by_type
        })


@extend_schema_view(
    list=extend_schema(
        summary="Listar respuestas",
        description="Obtiene la lista de respuestas a comentarios.",
        tags=['Comment Replies']
    ),
    retrieve=extend_schema(
        summary="Detalle de respuesta",
        description="Obtiene el detalle de una respuesta específica.",
        tags=['Comment Replies']
    ),
    create=extend_schema(
        summary="Crear respuesta",
        description="Crea una nueva respuesta a un comentario.",
        tags=['Comment Replies']
    ),
    update=extend_schema(
        summary="Actualizar respuesta",
        description="Actualiza una respuesta existente.",
        tags=['Comment Replies']
    ),
    partial_update=extend_schema(
        summary="Actualizar parcialmente respuesta",
        description="Actualiza parcialmente una respuesta existente.",
        tags=['Comment Replies']
    ),
    destroy=extend_schema(
        summary="Eliminar respuesta",
        description="Elimina una respuesta del sistema.",
        tags=['Comment Replies']
    )
)
class CommentReplyViewSet(viewsets.ModelViewSet):
    """
    ViewSet para respuestas a comentarios.
    """
    queryset = CommentReply.objects.all()
    serializer_class = CommentReplySerializer
    permission_classes = [IsAuthenticated, IsNotBlocked, CanViewComments]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['comment', 'author']
    ordering = ['created_at']
