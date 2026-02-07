from rest_framework import serializers
from .models import Assignment, AssignmentHistory
from professors.serializers import ProfessorListSerializer
from academic.serializers import SubjectListSerializer, FacultyListSerializer


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer completo para Asignaciones."""
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    assignment_type_display = serializers.CharField(source='get_assignment_type_display', read_only=True)
    assigned_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'professor', 'professor_name', 'subject', 'subject_name',
            'faculty', 'faculty_name', 'discipline_name', 'assignment_type',
            'assignment_type_display', 'hours_per_week', 'group',
            'academic_year', 'semester', 'order', 'is_active',
            'assigned_by', 'assigned_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'assigned_by', 'created_at', 'updated_at']
    
    def get_assigned_by_name(self, obj):
        return obj.assigned_by.get_full_name() if obj.assigned_by else None


class AssignmentCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear Asignaciones."""
    
    class Meta:
        model = Assignment
        fields = [
            'professor', 'subject', 'faculty', 'assignment_type',
            'hours_per_week', 'group', 'academic_year', 'semester', 'order'
        ]
    
    def create(self, validated_data):
        validated_data['assigned_by'] = self.context['request'].user
        return super().create(validated_data)


class AssignmentUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar Asignaciones."""
    
    class Meta:
        model = Assignment
        fields = [
            'professor', 'subject', 'faculty', 'assignment_type',
            'hours_per_week', 'group', 'academic_year', 'semester', 
            'order', 'is_active'
        ]


class AssignmentListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar Asignaciones."""
    professor_name = serializers.CharField(source='professor.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    discipline_name = serializers.CharField(source='discipline.name', read_only=True)
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'professor_name', 'subject_name', 'faculty_name',
            'discipline_name', 'academic_year', 'semester', 'is_active'
        ]


class AssignmentDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para una Asignación."""
    professor = ProfessorListSerializer(read_only=True)
    subject = SubjectListSerializer(read_only=True)
    faculty = FacultyListSerializer(read_only=True)
    assignment_type_display = serializers.CharField(source='get_assignment_type_display', read_only=True)
    assigned_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Assignment
        fields = [
            'id', 'professor', 'subject', 'faculty', 'assignment_type',
            'assignment_type_display', 'hours_per_week', 'group',
            'academic_year', 'semester', 'order', 'is_active',
            'assigned_by', 'assigned_by_name', 'created_at', 'updated_at'
        ]
    
    def get_assigned_by_name(self, obj):
        return obj.assigned_by.get_full_name() if obj.assigned_by else None


class AssignmentHistorySerializer(serializers.ModelSerializer):
    """Serializer para el historial de Asignaciones."""
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    performed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AssignmentHistory
        fields = [
            'id', 'assignment', 'action', 'action_display', 
            'changes', 'performed_by', 'performed_by_name', 'created_at'
        ]
    
    def get_performed_by_name(self, obj):
        return obj.performed_by.get_full_name() if obj.performed_by else None


class AssignmentExportSerializer(serializers.ModelSerializer):
    """Serializer para exportar Asignaciones a CSV/Excel."""
    professor_name = serializers.CharField(source='professor.full_name')
    professor_email = serializers.CharField(source='professor.email')
    professor_category = serializers.CharField(source='professor.get_category_display')
    subject_name = serializers.CharField(source='subject.name')
    subject_code = serializers.CharField(source='subject.code')
    faculty_name = serializers.CharField(source='faculty.name')
    discipline_name = serializers.CharField(source='discipline.name')
    assignment_type_display = serializers.CharField(source='get_assignment_type_display')
    
    class Meta:
        model = Assignment
        fields = [
            'professor_name', 'professor_email', 'professor_category',
            'subject_name', 'subject_code', 'faculty_name', 'discipline_name',
            'assignment_type_display', 'hours_per_week', 'group',
            'academic_year', 'semester'
        ]
