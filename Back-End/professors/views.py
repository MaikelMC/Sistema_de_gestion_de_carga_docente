from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, extend_schema_view
import csv

from .models import Professor
from .serializers import (
    ProfessorSerializer, ProfessorCreateSerializer,
    ProfessorListSerializer, ProfessorExportSerializer
)
from users.permissions import IsNotBlocked, CanAddProfessors, CanDownloadReports


@extend_schema_view(
    list=extend_schema(summary="Listar profesores", description="Obtiene todos los profesores.", tags=['Professors']),
    create=extend_schema(summary="Crear profesor", description="Crea un nuevo profesor.", tags=['Professors']),
    retrieve=extend_schema(summary="Obtener profesor", description="Obtiene los detalles de un profesor.", tags=['Professors']),
    update=extend_schema(summary="Actualizar profesor", description="Actualiza un profesor.", tags=['Professors']),
    partial_update=extend_schema(summary="Actualizar profesor parcialmente", tags=['Professors']),
    destroy=extend_schema(summary="Eliminar profesor", description="Elimina un profesor.", tags=['Professors']),
)
class ProfessorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Profesores.
    """
    queryset = Professor.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'category', 'scientific_degree', 'contract_type']
    search_fields = ['first_name', 'last_name', 'email', 'identification']
    ordering_fields = ['last_name', 'first_name', 'category', 'created_at']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProfessorCreateSerializer
        elif self.action == 'list':
            return ProfessorListSerializer
        return ProfessorSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsNotBlocked, CanAddProfessors]
        return super().get_permissions()
    
    @extend_schema(
        summary="Exportar profesores CSV",
        description="Descarga un archivo CSV con todos los profesores.",
        tags=['Professors'],
        responses={(200, 'text/csv'): bytes}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsNotBlocked, CanDownloadReports])
    def export_csv(self, request):
        """Exportar profesores a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="profesores.csv"'
        response.write('\ufeff')  # BOM para Excel
        
        writer = csv.writer(response)
        writer.writerow([
            'Nombre', 'Apellidos', 'Email', 'Teléfono', 'CI',
            'Categoría', 'Grado Científico', 'Tipo de Contrato',
            'Especialidad', 'Años de Experiencia'
        ])
        
        for professor in queryset:
            writer.writerow([
                professor.first_name,
                professor.last_name,
                professor.email,
                professor.phone or '',
                professor.identification,
                professor.get_category_display(),
                professor.get_scientific_degree_display(),
                professor.get_contract_type_display(),
                professor.specialty or '',
                professor.years_of_experience
            ])
        
        return response
    
    @extend_schema(summary="Categorías docentes", description="Obtiene las opciones de categorías docentes.", tags=['Professors'])
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Obtener opciones de categorías."""
        categories = [
            {'value': choice[0], 'label': choice[1]}
            for choice in Professor.Category.choices
        ]
        return Response(categories)
    
    @extend_schema(summary="Grados científicos", description="Obtiene las opciones de grados científicos.", tags=['Professors'])
    @action(detail=False, methods=['get'])
    def scientific_degrees(self, request):
        """Obtener opciones de grados científicos."""
        degrees = [
            {'value': choice[0], 'label': choice[1]}
            for choice in Professor.ScientificDegree.choices
        ]
        return Response(degrees)
    
    @extend_schema(summary="Tipos de contrato", description="Obtiene las opciones de tipos de contrato.", tags=['Professors'])
    @action(detail=False, methods=['get'])
    def contract_types(self, request):
        """Obtener opciones de tipos de contrato."""
        types = [
            {'value': choice[0], 'label': choice[1]}
            for choice in Professor.ContractType.choices
        ]
        return Response(types)
