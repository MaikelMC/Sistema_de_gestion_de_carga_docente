from django.db import models
from django.conf import settings
from academic.models import Faculty, Discipline, Subject
from professors.models import Professor


class Assignment(models.Model):
    """
    Modelo para las Asignaciones de profesores a asignaturas por facultad.
    Representa la carga docente de un profesor.
    """
    
    class AssignmentType(models.TextChoices):
        LECTURE = 'LECTURE', 'Conferencia'
        PRACTICAL = 'PRACTICAL', 'Clase Práctica'
        SEMINAR = 'SEMINAR', 'Seminario'
        LAB = 'LAB', 'Laboratorio'
        WORKSHOP = 'WORKSHOP', 'Taller'
    
    professor = models.ForeignKey(
        Professor,
        on_delete=models.CASCADE,
        related_name='assignments',
        verbose_name='Profesor'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='assignments',
        verbose_name='Asignatura'
    )
    faculty = models.ForeignKey(
        Faculty,
        on_delete=models.CASCADE,
        related_name='assignments',
        verbose_name='Facultad'
    )
    
    # Detalles de la asignación
    assignment_type = models.CharField(
        max_length=20,
        choices=AssignmentType.choices,
        default=AssignmentType.LECTURE,
        verbose_name='Tipo de Actividad'
    )
    hours_per_week = models.PositiveIntegerField(
        default=0,
        verbose_name='Horas por semana'
    )
    group = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='Grupo'
    )
    academic_year = models.CharField(
        max_length=20,
        verbose_name='Año Académico'
    )
    semester = models.PositiveIntegerField(
        choices=[(1, 'Primer Semestre'), (2, 'Segundo Semestre')],
        default=1,
        verbose_name='Semestre'
    )
    
    # Control de orden (para que los jefes puedan ordenar)
    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Orden'
    )
    
    # Metadatos
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assignments_made',
        verbose_name='Asignado por'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Fecha de actualización'
    )
    
    class Meta:
        verbose_name = 'Asignación'
        verbose_name_plural = 'Asignaciones'
        ordering = ['order', 'faculty', 'subject', 'professor']
        unique_together = [
            'professor', 'subject', 'faculty', 'assignment_type', 
            'academic_year', 'semester', 'group'
        ]
    
    def __str__(self):
        return f"{self.professor} - {self.subject} ({self.faculty})"
    
    @property
    def discipline(self):
        """Obtiene la disciplina a través de la asignatura."""
        return self.subject.discipline


class AssignmentHistory(models.Model):
    """
    Modelo para el historial de cambios en las asignaciones.
    Registra todas las modificaciones realizadas.
    """
    
    class ActionType(models.TextChoices):
        CREATE = 'CREATE', 'Creación'
        UPDATE = 'UPDATE', 'Modificación'
        DELETE = 'DELETE', 'Eliminación'
    
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name='history',
        verbose_name='Asignación'
    )
    action = models.CharField(
        max_length=10,
        choices=ActionType.choices,
        verbose_name='Acción'
    )
    changes = models.JSONField(
        default=dict,
        verbose_name='Cambios realizados'
    )
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assignment_changes',
        verbose_name='Realizado por'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha'
    )
    
    class Meta:
        verbose_name = 'Historial de Asignación'
        verbose_name_plural = 'Historial de Asignaciones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.assignment} por {self.performed_by}"
