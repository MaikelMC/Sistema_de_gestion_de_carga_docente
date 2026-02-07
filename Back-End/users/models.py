from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo de usuario personalizado con roles para el sistema de gestión de carga docente.
    """
    
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Administrador'
        DIRECTOR = 'DIRECTOR', 'Director de Formación'
        JEFE_DISCIPLINA = 'JEFE_DISCIPLINA', 'Jefe de Disciplina'
        JEFE_DEPARTAMENTO = 'JEFE_DEPARTAMENTO', 'Jefe de Departamento'
        VICEDECANO = 'VICEDECANO', 'Vicedecano de Formación'
    
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.JEFE_DISCIPLINA,
        verbose_name='Rol'
    )
    is_blocked = models.BooleanField(
        default=False,
        verbose_name='Bloqueado'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Teléfono'
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
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_director(self):
        return self.role == self.Role.DIRECTOR
    
    @property
    def is_jefe_disciplina(self):
        return self.role == self.Role.JEFE_DISCIPLINA
    
    @property
    def is_jefe_departamento(self):
        return self.role == self.Role.JEFE_DEPARTAMENTO
    
    @property
    def is_vicedecano(self):
        return self.role == self.Role.VICEDECANO
    
    def can_manage_users(self):
        """Solo el administrador puede gestionar usuarios."""
        return self.is_admin
    
    def can_add_professors(self):
        """Jefes de disciplina, departamento y vicedecano pueden agregar profesores."""
        return self.role in [
            self.Role.JEFE_DISCIPLINA,
            self.Role.JEFE_DEPARTAMENTO,
            self.Role.VICEDECANO
        ]
    
    def can_download_reports(self):
        """Director y Vicedecano pueden descargar reportes."""
        return self.role in [self.Role.DIRECTOR, self.Role.VICEDECANO]
    
    def can_view_comments(self):
        """Director y Vicedecano pueden ver comentarios."""
        return self.role in [self.Role.DIRECTOR, self.Role.VICEDECANO]
    
    def can_modify_assignments(self):
        """Jefes y Vicedecano pueden modificar asignaciones."""
        return self.role in [
            self.Role.JEFE_DISCIPLINA,
            self.Role.JEFE_DEPARTAMENTO,
            self.Role.VICEDECANO
        ]
