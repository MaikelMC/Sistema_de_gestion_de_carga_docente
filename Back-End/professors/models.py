from django.db import models
from django.conf import settings


class Professor(models.Model):
    """
    Modelo para los Profesores.
    """
    
    class Category(models.TextChoices):
        INSTRUCTOR = 'INSTRUCTOR', 'Instructor'
        ASISTENTE = 'ASISTENTE', 'Asistente'
        AUXILIAR = 'AUXILIAR', 'Auxiliar'
        TITULAR = 'TITULAR', 'Titular'
    
    class ScientificDegree(models.TextChoices):
        NONE = 'NONE', 'Ninguno'
        MSC = 'MSC', 'Máster en Ciencias'
        DR = 'DR', 'Doctor en Ciencias'
    
    class ContractType(models.TextChoices):
        FULL_TIME = 'FULL_TIME', 'Tiempo Completo'
        PART_TIME = 'PART_TIME', 'Tiempo Parcial'
        HOURLY = 'HOURLY', 'Por Horas'
    
    # Información personal
    first_name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    last_name = models.CharField(
        max_length=100,
        verbose_name='Apellidos'
    )
    email = models.EmailField(
        unique=True,
        verbose_name='Correo electrónico'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Teléfono'
    )
    identification = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Carnet de Identidad'
    )
    
    # Información académica
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.INSTRUCTOR,
        verbose_name='Categoría Docente'
    )
    scientific_degree = models.CharField(
        max_length=20,
        choices=ScientificDegree.choices,
        default=ScientificDegree.NONE,
        verbose_name='Grado Científico'
    )
    contract_type = models.CharField(
        max_length=20,
        choices=ContractType.choices,
        default=ContractType.FULL_TIME,
        verbose_name='Tipo de Contrato'
    )
    specialty = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Especialidad'
    )
    years_of_experience = models.PositiveIntegerField(
        default=0,
        verbose_name='Años de experiencia'
    )
    
    # Metadatos
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='professors_created',
        verbose_name='Creado por'
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
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.last_name}, {self.first_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_active_assignments(self):
        return self.assignments.filter(is_active=True)
