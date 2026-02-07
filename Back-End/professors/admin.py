from django.contrib import admin
from .models import Professor


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    """Configuración del admin para Profesores."""
    
    list_display = [
        'full_name', 'email', 'identification', 'category', 
        'scientific_degree', 'contract_type', 'is_active'
    ]
    list_filter = ['category', 'scientific_degree', 'contract_type', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'identification']
    ordering = ['last_name', 'first_name']
    raw_id_fields = ['created_by']
    readonly_fields = ['created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'identification')
        }),
        ('Información Académica', {
            'fields': ('category', 'scientific_degree', 'contract_type', 'specialty', 'years_of_experience')
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Metadatos', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
