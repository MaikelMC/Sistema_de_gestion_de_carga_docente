from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para login JWT que devuelve datos del usuario.
    Acepta login por email o username.
    """
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Permitir login con email
        self.fields['email'] = serializers.EmailField()
        # Eliminar el campo username por defecto si existe
        if 'username' in self.fields:
            del self.fields['username']
    
    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        
        # Buscar el usuario por email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'detail': 'Credenciales inválidas. Verifique su email y contraseña.'
            })
        
        if not user.check_password(password):
            raise serializers.ValidationError({
                'detail': 'Credenciales inválidas. Verifique su email y contraseña.'
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                'detail': 'Esta cuenta ha sido desactivada.'
            })
        
        if user.is_blocked:
            raise serializers.ValidationError({
                'detail': 'Su cuenta está bloqueada. Contacte al administrador.'
            })
        
        # Generar tokens manualmente
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        # Actualizar último login
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        # Mapeo de roles backend → frontend
        role_map = {
            'ADMIN': 'admin',
            'DIRECTOR': 'director',
            'JEFE_DISCIPLINA': 'jefe_disciplina',
            'JEFE_DEPARTAMENTO': 'jefe_departamento',
            'VICEDECANO': 'vicedecano',
        }
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.get_full_name() or user.username,
                'role': role_map.get(user.role, user.role.lower()),
                'department': None,
            }
        }


class UserSerializer(serializers.ModelSerializer):
    """Serializer para ver información de usuarios."""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'role', 'role_display', 'phone', 'is_active', 
            'is_blocked', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear usuarios."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'phone'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar usuarios."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone', 'is_active', 'is_blocked'
        ]
        read_only_fields = ['id']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambiar contraseña."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        return attrs


class AdminChangePasswordSerializer(serializers.Serializer):
    """Serializer para que el admin cambie contraseña de otros usuarios."""
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.'
            })
        return attrs


class LoginSerializer(serializers.Serializer):
    """Serializer para login."""
    username = serializers.CharField()
    password = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro público de usuarios."""
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)
    cargo = serializers.CharField(write_only=True, required=False)
    disciplina = serializers.CharField(write_only=True, required=False)
    faculty = serializers.CharField(write_only=True, required=False)
    carrera = serializers.CharField(write_only=True, required=False)
    asignatura = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'name',
            'cargo', 'disciplina', 'faculty', 'carrera', 'asignatura'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        name = validated_data.pop('name', '')
        cargo = validated_data.pop('cargo', '')
        disciplina = validated_data.pop('disciplina', '')
        faculty = validated_data.pop('faculty', '')
        carrera = validated_data.pop('carrera', '')
        asignatura = validated_data.pop('asignatura', '')
        password = validated_data.pop('password')
        
        # Separar nombre en first_name y last_name
        name_parts = name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Mapear cargo a rol
        cargo_role_map = {
            'jefe de disciplina': 'JEFE_DISCIPLINA',
            'jefe de departamento': 'JEFE_DEPARTAMENTO',
            'Vicedecano': 'VICEDECANO',
            'Director': 'DIRECTOR',
        }
        role = cargo_role_map.get(cargo, 'JEFE_DISCIPLINA')
        
        # Usar email como username
        username = validated_data['email'].split('@')[0]
        # Asegurar username único
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User(
            username=username,
            email=validated_data['email'],
            first_name=first_name,
            last_name=last_name,
            role=role,
        )
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para el perfil del usuario actual."""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'phone', 'permissions'
        ]
        read_only_fields = ['id', 'role', 'role_display']
    
    def get_permissions(self, obj):
        return {
            'can_manage_users': obj.can_manage_users(),
            'can_add_professors': obj.can_add_professors(),
            'can_download_reports': obj.can_download_reports(),
            'can_view_comments': obj.can_view_comments(),
            'can_modify_assignments': obj.can_modify_assignments(),
        }
