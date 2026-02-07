from django.contrib import admin
from .models import Comment, CommentReply


class CommentReplyInline(admin.TabularInline):
    """Inline para respuestas en comentarios."""
    model = CommentReply
    extra = 0
    readonly_fields = ['author', 'created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Configuración del admin para Comentarios."""
    
    list_display = [
        'subject', 'author', 'comment_type', 'is_read', 
        'created_at', 'replies_count'
    ]
    list_filter = ['comment_type', 'is_read', 'created_at']
    search_fields = ['subject', 'message', 'author__username']
    ordering = ['-created_at']
    raw_id_fields = ['author', 'assignment', 'read_by']
    readonly_fields = ['created_at', 'updated_at', 'read_at']
    inlines = [CommentReplyInline]
    
    fieldsets = (
        ('Contenido', {
            'fields': ('author', 'assignment', 'comment_type', 'subject', 'message')
        }),
        ('Estado de Lectura', {
            'fields': ('is_read', 'read_by', 'read_at')
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Respuestas')
    def replies_count(self, obj):
        return obj.replies.count()


@admin.register(CommentReply)
class CommentReplyAdmin(admin.ModelAdmin):
    """Configuración del admin para Respuestas a Comentarios."""
    
    list_display = ['comment', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['message', 'author__username', 'comment__subject']
    ordering = ['-created_at']
    raw_id_fields = ['comment', 'author']
    readonly_fields = ['created_at']
