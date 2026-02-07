from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
import csv

from .models import Assignment, AssignmentHistory
from .serializers import (
    AssignmentSerializer, AssignmentCreateSerializer,
    AssignmentUpdateSerializer, AssignmentListSerializer,
    AssignmentDetailSerializer, AssignmentHistorySerializer,
    AssignmentExportSerializer
)
from users.permissions import IsNotBlocked, CanModifyAssignments, CanDownloadReports


@extend_schema_view(
    list=extend_schema(summary="Listar asignaciones", description="Obtiene todas las asignaciones de profesores.", tags=['Assignments']),
    create=extend_schema(summary="Crear asignación", description="Crea una nueva asignación de profesor a asignatura.", tags=['Assignments']),
    retrieve=extend_schema(summary="Obtener asignación", description="Obtiene los detalles de una asignación.", tags=['Assignments']),
    update=extend_schema(summary="Actualizar asignación", description="Actualiza una asignación.", tags=['Assignments']),
    partial_update=extend_schema(summary="Actualizar asignación parcialmente", tags=['Assignments']),
    destroy=extend_schema(summary="Eliminar asignación", description="Elimina una asignación.", tags=['Assignments']),
)
class AssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Asignaciones de profesores.
    """
    queryset = Assignment.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'is_active', 'faculty', 'subject', 'professor', 
        'academic_year', 'semester', 'assignment_type'
    ]
    search_fields = [
        'professor__first_name', 'professor__last_name',
        'subject__name', 'faculty__name'
    ]
    ordering_fields = ['order', 'faculty', 'subject', 'professor', 'created_at']
    ordering = ['order', 'faculty', 'subject']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AssignmentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AssignmentUpdateSerializer
        elif self.action == 'list':
            return AssignmentListSerializer
        elif self.action == 'retrieve':
            return AssignmentDetailSerializer
        return AssignmentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsNotBlocked, CanModifyAssignments]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Assignment.objects.select_related(
            'professor', 'subject', 'subject__discipline', 'faculty', 'assigned_by'
        ).all()
        
        user = self.request.user
        # Filtrar por disciplina del jefe
        if user.is_jefe_disciplina:
            queryset = queryset.filter(subject__discipline__head=user)
        
        # Filtros adicionales por query params
        discipline = self.request.query_params.get('discipline', None)
        if discipline:
            queryset = queryset.filter(subject__discipline_id=discipline)
        
        return queryset
    
    def perform_create(self, serializer):
        assignment = serializer.save()
        # Registrar en historial
        AssignmentHistory.objects.create(
            assignment=assignment,
            action=AssignmentHistory.ActionType.CREATE,
            changes={'created': True},
            performed_by=self.request.user
        )
    
    def perform_update(self, serializer):
        old_data = AssignmentSerializer(self.get_object()).data
        assignment = serializer.save()
        new_data = AssignmentSerializer(assignment).data
        
        # Calcular cambios
        changes = {}
        for key in new_data:
            if old_data.get(key) != new_data.get(key):
                changes[key] = {
                    'old': old_data.get(key),
                    'new': new_data.get(key)
                }
        
        # Registrar en historial
        if changes:
            AssignmentHistory.objects.create(
                assignment=assignment,
                action=AssignmentHistory.ActionType.UPDATE,
                changes=changes,
                performed_by=self.request.user
            )
    
    @extend_schema(
        summary="Exportar asignaciones CSV",
        description="Descarga un archivo CSV con todas las asignaciones.",
        tags=['Assignments'],
        responses={(200, 'text/csv'): bytes}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsNotBlocked, CanDownloadReports])
    def export_csv(self, request):
        """Exportar asignaciones a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="asignaciones.csv"'
        response.write('\ufeff')  # BOM para Excel
        
        writer = csv.writer(response)
        writer.writerow([
            'Profesor', 'Email Profesor', 'Categoría', 
            'Asignatura', 'Código Asignatura', 'Facultad', 
            'Disciplina', 'Tipo de Actividad', 'Horas/Semana',
            'Grupo', 'Año Académico', 'Semestre'
        ])
        
        for assignment in queryset:
            writer.writerow([
                assignment.professor.full_name,
                assignment.professor.email,
                assignment.professor.get_category_display(),
                assignment.subject.name,
                assignment.subject.code,
                assignment.faculty.name,
                assignment.subject.discipline.name,
                assignment.get_assignment_type_display(),
                assignment.hours_per_week,
                assignment.group or '',
                assignment.academic_year,
                assignment.semester
            ])
        
        return response
    
    @extend_schema(
        summary="Exportar por facultad CSV",
        description="Descarga un archivo CSV con las asignaciones de una facultad específica.",
        tags=['Assignments'],
        parameters=[OpenApiParameter(name='faculty', description='ID de la facultad', required=True, type=int)],
        responses={(200, 'text/csv'): bytes}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsNotBlocked, CanDownloadReports])
    def export_by_faculty(self, request):
        """Exportar asignaciones por facultad a CSV."""
        faculty_id = request.query_params.get('faculty', None)
        if not faculty_id:
            return Response(
                {'error': 'Debe especificar una facultad.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset().filter(faculty_id=faculty_id)
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="asignaciones_facultad_{faculty_id}.csv"'
        response.write('\ufeff')
        
        writer = csv.writer(response)
        writer.writerow([
            'Profesor', 'Email', 'Asignatura', 'Disciplina',
            'Tipo', 'Horas/Semana', 'Grupo', 'Semestre'
        ])
        
        for assignment in queryset:
            writer.writerow([
                assignment.professor.full_name,
                assignment.professor.email,
                assignment.subject.name,
                assignment.subject.discipline.name,
                assignment.get_assignment_type_display(),
                assignment.hours_per_week,
                assignment.group or '',
                assignment.semester
            ])
        
        return response
    
    @extend_schema(
        summary="Exportar por disciplina CSV",
        description="Descarga un archivo CSV con las asignaciones de una disciplina específica.",
        tags=['Assignments'],
        parameters=[OpenApiParameter(name='discipline', description='ID de la disciplina', required=True, type=int)],
        responses={(200, 'text/csv'): bytes}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsNotBlocked, CanDownloadReports])
    def export_by_discipline(self, request):
        """Exportar asignaciones por disciplina a CSV."""
        discipline_id = request.query_params.get('discipline', None)
        if not discipline_id:
            return Response(
                {'error': 'Debe especificar una disciplina.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.get_queryset().filter(subject__discipline_id=discipline_id)
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="asignaciones_disciplina_{discipline_id}.csv"'
        response.write('\ufeff')
        
        writer = csv.writer(response)
        writer.writerow([
            'Profesor', 'Email', 'Asignatura', 'Facultad',
            'Tipo', 'Horas/Semana', 'Grupo', 'Semestre'
        ])
        
        for assignment in queryset:
            writer.writerow([
                assignment.professor.full_name,
                assignment.professor.email,
                assignment.subject.name,
                assignment.faculty.name,
                assignment.get_assignment_type_display(),
                assignment.hours_per_week,
                assignment.group or '',
                assignment.semester
            ])
        
        return response
    
    @extend_schema(
        summary="Historial de asignación",
        description="Obtiene el historial de cambios de una asignación específica.",
        tags=['Assignments'],
        responses={200: AssignmentHistorySerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Obtener historial de cambios de una asignación."""
        assignment = self.get_object()
        history = assignment.history.all()
        serializer = AssignmentHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Tipos de asignación",
        description="Obtiene la lista de tipos de asignación disponibles (Conferencia, Clase Práctica, etc.).",
        tags=['Assignments']
    )
    @action(detail=False, methods=['get'])
    def assignment_types(self, request):
        """Obtener tipos de asignación."""
        types = [
            {'value': choice[0], 'label': choice[1]}
            for choice in Assignment.AssignmentType.choices
        ]
        return Response(types)


@extend_schema_view(
    list=extend_schema(
        summary="Listar historial",
        description="Obtiene la lista de todos los cambios realizados en las asignaciones.",
        tags=['Assignment History']
    ),
    retrieve=extend_schema(
        summary="Detalle de historial",
        description="Obtiene el detalle de un registro específico del historial.",
        tags=['Assignment History']
    )
)
class AssignmentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para historial de asignaciones.
    """
    queryset = AssignmentHistory.objects.all()
    serializer_class = AssignmentHistorySerializer
    permission_classes = [IsAuthenticated, IsNotBlocked]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['assignment', 'action', 'performed_by']
    ordering = ['-created_at']
