from django.db import models
from django.conf import settings


class Faculty(models.Model):
    """
    Modelo para las Facultades de la universidad.
    """
    name = models.CharField(
        max_length=200,
        unique=True,
        verbose_name='Nombre'
    )
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Código'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
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
        verbose_name = 'Facultad'
        verbose_name_plural = 'Facultades'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Discipline(models.Model):
    """
    Modelo para las Disciplinas académicas.
    Una disciplina puede tener varias asignaturas.
    """
    name = models.CharField(
        max_length=200,
        verbose_name='Nombre'
    )
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Código'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    head = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='disciplines_headed',
        verbose_name='Jefe de Disciplina',
        limit_choices_to={'role__in': ['JEFE_DISCIPLINA', 'JEFE_DEPARTAMENTO']}
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
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
        verbose_name = 'Disciplina'
        verbose_name_plural = 'Disciplinas'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def get_subjects_count(self):
        return self.subjects.count()


class Subject(models.Model):
    """
    Modelo para las Asignaturas.
    Cada asignatura pertenece a una disciplina.
    """
    name = models.CharField(
        max_length=200,
        verbose_name='Nombre'
    )
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Código'
    )
    discipline = models.ForeignKey(
        Discipline,
        on_delete=models.CASCADE,
        related_name='subjects',
        verbose_name='Disciplina'
    )
    hours_per_week = models.PositiveIntegerField(
        default=0,
        verbose_name='Horas por semana'
    )
    semester = models.PositiveIntegerField(
        default=1,
        verbose_name='Semestre'
    )
    year = models.PositiveIntegerField(
        default=1,
        verbose_name='Año'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
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
        verbose_name = 'Asignatura'
        verbose_name_plural = 'Asignaturas'
        ordering = ['discipline', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.discipline.name})"
