from django.db import models
from django.conf import settings
from assignments.models import Assignment


class Comment(models.Model):
    """
    Modelo para los Comentarios/Mensajes que dejan los jefes de disciplina
    cuando realizan modificaciones en el sistema.
    """
    
    class CommentType(models.TextChoices):
        MODIFICATION = 'MODIFICATION', 'Modificación'
        ASSIGNMENT = 'ASSIGNMENT', 'Nueva Asignación'
        DELETION = 'DELETION', 'Eliminación'
        GENERAL = 'GENERAL', 'General'
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Autor'
    )
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments',
        verbose_name='Asignación relacionada'
    )
    comment_type = models.CharField(
        max_length=20,
        choices=CommentType.choices,
        default=CommentType.MODIFICATION,
        verbose_name='Tipo de comentario'
    )
    subject = models.CharField(
        max_length=200,
        verbose_name='Asunto'
    )
    message = models.TextField(
        verbose_name='Mensaje'
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name='Leído'
    )
    read_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='comments_read',
        verbose_name='Leído por'
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Fecha de lectura'
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
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.author}"
    
    def mark_as_read(self, user):
        """Marca el comentario como leído por un usuario."""
        from django.utils import timezone
        self.is_read = True
        self.read_by = user
        self.read_at = timezone.now()
        self.save()


class CommentReply(models.Model):
    """
    Modelo para respuestas a los comentarios.
    Permite que el Director responda a los comentarios.
    """
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='replies',
        verbose_name='Comentario'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comment_replies',
        verbose_name='Autor'
    )
    message = models.TextField(
        verbose_name='Respuesta'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    
    class Meta:
        verbose_name = 'Respuesta a comentario'
        verbose_name_plural = 'Respuestas a comentarios'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Respuesta de {self.author} a {self.comment.subject}"
