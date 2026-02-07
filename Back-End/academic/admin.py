from django.contrib import admin
from .models import Faculty, Discipline, Subject


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    """Configuración del admin para Facultades."""
    
    list_display = ['name', 'code', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    """Configuración del admin para Disciplinas."""
    
    list_display = ['name', 'code', 'head', 'is_active', 'get_subjects_count']
    list_filter = ['is_active', 'head']
    search_fields = ['name', 'code']
    ordering = ['name']
    raw_id_fields = ['head']
    
    @admin.display(description='Asignaturas')
    def get_subjects_count(self, obj):
        return obj.get_subjects_count()


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    """Configuración del admin para Asignaturas."""
    
    list_display = ['name', 'code', 'discipline', 'semester', 'year', 'hours_per_week', 'is_active']
    list_filter = ['is_active', 'discipline', 'semester', 'year']
    search_fields = ['name', 'code']
    ordering = ['discipline', 'name']
    raw_id_fields = ['discipline']
