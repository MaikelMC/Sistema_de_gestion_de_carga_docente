from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Configuración del admin para el modelo User personalizado."""
    
    list_display = [
        'username', 'email', 'first_name', 'last_name', 
        'role', 'is_active', 'is_blocked', 'created_at'
    ]
    list_filter = ['role', 'is_active', 'is_blocked', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información Adicional', {
            'fields': ('role', 'phone', 'is_blocked')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Información Adicional', {
            'fields': ('role', 'phone', 'first_name', 'last_name', 'email')
        }),
    )
    
    actions = ['block_users', 'unblock_users']
    
    @admin.action(description='Bloquear usuarios seleccionados')
    def block_users(self, request, queryset):
        queryset.update(is_blocked=True)
    
    @admin.action(description='Desbloquear usuarios seleccionados')
    def unblock_users(self, request, queryset):
        queryset.update(is_blocked=False)
