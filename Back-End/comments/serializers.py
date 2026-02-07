from rest_framework import serializers
from .models import Comment, CommentReply


class CommentReplySerializer(serializers.ModelSerializer):
    """Serializer para respuestas a comentarios."""
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CommentReply
        fields = [
            'id', 'comment', 'author', 'author_name', 
            'message', 'created_at'
        ]
        read_only_fields = ['id', 'author', 'created_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name()
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class CommentSerializer(serializers.ModelSerializer):
    """Serializer completo para Comentarios."""
    author_name = serializers.SerializerMethodField()
    author_role = serializers.CharField(source='author.get_role_display', read_only=True)
    comment_type_display = serializers.CharField(source='get_comment_type_display', read_only=True)
    replies = CommentReplySerializer(many=True, read_only=True)
    read_by_name = serializers.SerializerMethodField()
    assignment_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'author_name', 'author_role', 'assignment',
            'assignment_info', 'comment_type', 'comment_type_display',
            'subject', 'message', 'is_read', 'read_by', 'read_by_name',
            'read_at', 'replies', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'is_read', 'read_by', 'read_at', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.get_full_name()
    
    def get_read_by_name(self, obj):
        return obj.read_by.get_full_name() if obj.read_by else None
    
    def get_assignment_info(self, obj):
        if obj.assignment:
            return {
                'id': obj.assignment.id,
                'professor': obj.assignment.professor.full_name,
                'subject': obj.assignment.subject.name,
                'faculty': obj.assignment.faculty.name
            }
        return None


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear Comentarios."""
    
    class Meta:
        model = Comment
        fields = [
            'assignment', 'comment_type', 'subject', 'message'
        ]
        extra_kwargs = {
            'assignment': {'required': False, 'allow_null': True},
            'comment_type': {'required': False},
        }
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        if 'comment_type' not in validated_data:
            validated_data['comment_type'] = 'GENERAL'
        return super().create(validated_data)


class CommentListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar Comentarios."""
    author_name = serializers.SerializerMethodField()
    author_role = serializers.CharField(source='author.get_role_display', read_only=True)
    comment_type_display = serializers.CharField(source='get_comment_type_display', read_only=True)
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'author_name', 'author_role', 'comment_type', 
            'comment_type_display', 'subject', 'message', 'is_read', 
            'replies_count', 'created_at'
        ]
    
    def get_author_name(self, obj):
        return obj.author.get_full_name()
    
    def get_replies_count(self, obj):
        return obj.replies.count()
