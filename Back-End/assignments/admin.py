from django.contrib import admin
from .models import Assignment, AssignmentHistory


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    """Configuración del admin para Asignaciones."""
    
    list_display = [
        'professor', 'subject', 'faculty', 'assignment_type',
        'academic_year', 'semester', 'hours_per_week', 'is_active'
    ]
    list_filter = [
        'is_active', 'faculty', 'subject__discipline', 
        'academic_year', 'semester', 'assignment_type'
    ]
    search_fields = [
        'professor__first_name', 'professor__last_name',
        'subject__name', 'faculty__name'
    ]
    ordering = ['order', 'faculty', 'subject']
    raw_id_fields = ['professor', 'subject', 'faculty', 'assigned_by']
    readonly_fields = ['created_at', 'updated_at', 'assigned_by']
    
    fieldsets = (
        ('Asignación Principal', {
            'fields': ('professor', 'subject', 'faculty')
        }),
        ('Detalles', {
            'fields': ('assignment_type', 'hours_per_week', 'group', 'academic_year', 'semester', 'order')
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Metadatos', {
            'fields': ('assigned_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AssignmentHistory)
class AssignmentHistoryAdmin(admin.ModelAdmin):
    """Configuración del admin para Historial de Asignaciones."""
    
    list_display = ['assignment', 'action', 'performed_by', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['assignment__professor__last_name', 'assignment__subject__name']
    ordering = ['-created_at']
    readonly_fields = ['assignment', 'action', 'changes', 'performed_by', 'created_at']
