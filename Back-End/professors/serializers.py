from rest_framework import serializers
from .models import Professor


class ProfessorSerializer(serializers.ModelSerializer):
    """Serializer completo para Profesores."""
    full_name = serializers.CharField(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    scientific_degree_display = serializers.CharField(source='get_scientific_degree_display', read_only=True)
    contract_type_display = serializers.CharField(source='get_contract_type_display', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    active_assignments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Professor
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 
            'phone', 'identification', 'category', 'category_display',
            'scientific_degree', 'scientific_degree_display',
            'contract_type', 'contract_type_display', 'specialty',
            'years_of_experience', 'is_active', 'created_by', 
            'created_by_name', 'active_assignments_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None
    
    def get_active_assignments_count(self, obj):
        return obj.get_active_assignments().count()


class ProfessorCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear Profesores."""
    
    class Meta:
        model = Professor
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'identification', 'category', 'scientific_degree',
            'contract_type', 'specialty', 'years_of_experience'
        ]
    
    def create(self, validated_data):
        # Asignar el usuario que crea el profesor
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ProfessorListSerializer(serializers.ModelSerializer):
    """Serializer para listar Profesores con todos los campos que necesita el frontend."""
    full_name = serializers.CharField(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    scientific_degree_display = serializers.CharField(source='get_scientific_degree_display', read_only=True)
    contract_type_display = serializers.CharField(source='get_contract_type_display', read_only=True)
    
    class Meta:
        model = Professor
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 
            'email', 'phone', 'identification', 'category', 'category_display',
            'scientific_degree', 'scientific_degree_display',
            'contract_type', 'contract_type_display', 'specialty',
            'years_of_experience', 'is_active', 'created_at'
        ]


class ProfessorExportSerializer(serializers.ModelSerializer):
    """Serializer para exportar Profesores a CSV/Excel."""
    category_display = serializers.CharField(source='get_category_display')
    scientific_degree_display = serializers.CharField(source='get_scientific_degree_display')
    contract_type_display = serializers.CharField(source='get_contract_type_display')
    
    class Meta:
        model = Professor
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'identification',
            'category_display', 'scientific_degree_display', 
            'contract_type_display', 'specialty', 'years_of_experience'
        ]
