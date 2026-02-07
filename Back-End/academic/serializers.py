from rest_framework import serializers
from .models import Faculty, Discipline, Subject


class FacultySerializer(serializers.ModelSerializer):
    """Serializer para Facultades."""
    
    class Meta:
        model = Faculty
        fields = [
            'id', 'name', 'code', 'description', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FacultyListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar Facultades."""
    
    class Meta:
        model = Faculty
        fields = ['id', 'name', 'code', 'is_active']


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer para Asignaturas."""
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'discipline', 'discipline_name',
            'hours_per_week', 'semester', 'year', 'description',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubjectListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar Asignaturas."""
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'discipline', 'discipline_name', 'is_active']


class DisciplineSerializer(serializers.ModelSerializer):
    """Serializer para Disciplinas."""
    subjects = SubjectListSerializer(many=True, read_only=True)
    subjects_count = serializers.SerializerMethodField()
    head_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Discipline
        fields = [
            'id', 'name', 'code', 'description', 'head', 'head_name',
            'is_active', 'subjects', 'subjects_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_subjects_count(self, obj):
        return obj.get_subjects_count()
    
    def get_head_name(self, obj):
        return obj.head.get_full_name() if obj.head else None


class DisciplineListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar Disciplinas."""
    subjects_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Discipline
        fields = ['id', 'name', 'code', 'is_active', 'subjects_count']
    
    def get_subjects_count(self, obj):
        return obj.get_subjects_count()
