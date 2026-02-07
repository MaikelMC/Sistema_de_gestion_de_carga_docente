from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Faculty, Discipline, Subject
from .serializers import (
    FacultySerializer, FacultyListSerializer,
    DisciplineSerializer, DisciplineListSerializer,
    SubjectSerializer, SubjectListSerializer
)
from users.permissions import IsNotBlocked, CanManageAcademic


@extend_schema_view(
    list=extend_schema(summary="Listar facultades", description="Obtiene todas las facultades.", tags=['Academic']),
    create=extend_schema(summary="Crear facultad", description="Crea una nueva facultad.", tags=['Academic']),
    retrieve=extend_schema(summary="Obtener facultad", description="Obtiene los detalles de una facultad.", tags=['Academic']),
    update=extend_schema(summary="Actualizar facultad", description="Actualiza una facultad.", tags=['Academic']),
    partial_update=extend_schema(summary="Actualizar facultad parcialmente", tags=['Academic']),
    destroy=extend_schema(summary="Eliminar facultad", description="Elimina una facultad.", tags=['Academic']),
)
class FacultyViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Facultades.
    Lectura para todos los autenticados, escritura para admin y vicedecano.
    """
    queryset = Faculty.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked, CanManageAcademic]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FacultyListSerializer
        return FacultySerializer


@extend_schema_view(
    list=extend_schema(summary="Listar disciplinas", description="Obtiene todas las disciplinas.", tags=['Academic']),
    create=extend_schema(summary="Crear disciplina", description="Crea una nueva disciplina.", tags=['Academic']),
    retrieve=extend_schema(summary="Obtener disciplina", description="Obtiene los detalles de una disciplina con sus asignaturas.", tags=['Academic']),
    update=extend_schema(summary="Actualizar disciplina", description="Actualiza una disciplina.", tags=['Academic']),
    partial_update=extend_schema(summary="Actualizar disciplina parcialmente", tags=['Academic']),
    destroy=extend_schema(summary="Eliminar disciplina", description="Elimina una disciplina.", tags=['Academic']),
)
class DisciplineViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Disciplinas.
    Lectura para todos los autenticados, escritura para admin y vicedecano.
    """
    queryset = Discipline.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked, CanManageAcademic]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'head']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DisciplineListSerializer
        return DisciplineSerializer
    
    def get_queryset(self):
        queryset = Discipline.objects.all()
        # Si es jefe de disciplina, puede ver solo las suyas
        user = self.request.user
        if user.is_jefe_disciplina:
            queryset = queryset.filter(head=user)
        return queryset


@extend_schema_view(
    list=extend_schema(summary="Listar asignaturas", description="Obtiene todas las asignaturas.", tags=['Academic']),
    create=extend_schema(summary="Crear asignatura", description="Crea una nueva asignatura.", tags=['Academic']),
    retrieve=extend_schema(summary="Obtener asignatura", description="Obtiene los detalles de una asignatura.", tags=['Academic']),
    update=extend_schema(summary="Actualizar asignatura", description="Actualiza una asignatura.", tags=['Academic']),
    partial_update=extend_schema(summary="Actualizar asignatura parcialmente", tags=['Academic']),
    destroy=extend_schema(summary="Eliminar asignatura", description="Elimina una asignatura.", tags=['Academic']),
)
class SubjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de Asignaturas.
    Lectura para todos los autenticados, escritura para admin y vicedecano.
    """
    queryset = Subject.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked, CanManageAcademic]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'discipline', 'semester', 'year']
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'discipline', 'semester', 'year']
    ordering = ['discipline', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubjectListSerializer
        return SubjectSerializer
    
    def get_queryset(self):
        queryset = Subject.objects.select_related('discipline').all()
        # Si es jefe de disciplina, puede ver solo las de sus disciplinas
        user = self.request.user
        if user.is_jefe_disciplina:
            queryset = queryset.filter(discipline__head=user)
        return queryset
