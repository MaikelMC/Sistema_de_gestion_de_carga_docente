from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    ChangePasswordSerializer, AdminChangePasswordSerializer,
    UserProfileSerializer, CustomTokenObtainPairSerializer,
    RegisterSerializer
)
from .permissions import IsAdmin, CanManageUsers, IsNotBlocked

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para login que devuelve datos del usuario junto con los tokens.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@extend_schema(tags=['Auth'])
class RegisterView(generics.CreateAPIView):
    """
    Vista para registro público de usuarios.
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    @extend_schema(summary="Registrar usuario", description="Registra un nuevo usuario en el sistema.")
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generar tokens para auto-login
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        role_map = {
            'ADMIN': 'admin',
            'DIRECTOR': 'director',
            'JEFE_DISCIPLINA': 'jefe_disciplina',
            'JEFE_DEPARTAMENTO': 'jefe_departamento',
            'VICEDECANO': 'vicedecano',
        }
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.get_full_name(),
                'role': role_map.get(user.role, user.role.lower()),
                'department': None,
            }
        }, status=status.HTTP_201_CREATED)


@extend_schema_view(
    list=extend_schema(
        summary="Listar usuarios",
        description="Obtiene la lista de todos los usuarios del sistema. Solo administradores.",
        tags=['Users']
    ),
    create=extend_schema(
        summary="Crear usuario",
        description="Crea un nuevo usuario en el sistema. Solo administradores.",
        tags=['Users']
    ),
    retrieve=extend_schema(
        summary="Obtener usuario",
        description="Obtiene los detalles de un usuario específico.",
        tags=['Users']
    ),
    update=extend_schema(
        summary="Actualizar usuario",
        description="Actualiza todos los datos de un usuario.",
        tags=['Users']
    ),
    partial_update=extend_schema(
        summary="Actualizar usuario parcialmente",
        description="Actualiza algunos datos de un usuario.",
        tags=['Users']
    ),
    destroy=extend_schema(
        summary="Eliminar usuario",
        description="Elimina un usuario del sistema.",
        tags=['Users']
    ),
)
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de usuarios.
    Solo accesible por administradores.
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsNotBlocked, CanManageUsers]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        is_active = self.request.query_params.get('is_active', None)
        is_blocked = self.request.query_params.get('is_blocked', None)
        
        if role:
            queryset = queryset.filter(role=role)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        if is_blocked is not None:
            queryset = queryset.filter(is_blocked=is_blocked.lower() == 'true')
        
        return queryset
    
    @extend_schema(
        summary="Bloquear usuario",
        description="Bloquea un usuario impidiendo su acceso al sistema.",
        tags=['Users'],
        responses={200: {'description': 'Usuario bloqueado correctamente'}}
    )
    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        """Bloquear un usuario."""
        user = self.get_object()
        if user == request.user:
            return Response(
                {'error': 'No puede bloquearse a sí mismo.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.is_blocked = True
        user.save()
        return Response({'message': f'Usuario {user.username} bloqueado correctamente.'})
    
    @extend_schema(
        summary="Desbloquear usuario",
        description="Desbloquea un usuario permitiendo su acceso al sistema.",
        tags=['Users'],
        responses={200: {'description': 'Usuario desbloqueado correctamente'}}
    )
    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        """Desbloquear un usuario."""
        user = self.get_object()
        user.is_blocked = False
        user.save()
        return Response({'message': f'Usuario {user.username} desbloqueado correctamente.'})
    
    @extend_schema(
        summary="Cambiar contraseña (Admin)",
        description="Permite al administrador cambiar la contraseña de un usuario.",
        tags=['Users'],
        request=AdminChangePasswordSerializer,
        responses={200: {'description': 'Contraseña cambiada correctamente'}}
    )
    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        """Cambiar contraseña de un usuario (admin)."""
        user = self.get_object()
        serializer = AdminChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Contraseña cambiada correctamente.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Auth'])
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para ver y actualizar el perfil del usuario actual.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsNotBlocked]
    
    @extend_schema(summary="Obtener perfil", description="Obtiene el perfil del usuario autenticado.")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(summary="Actualizar perfil", description="Actualiza el perfil del usuario autenticado.")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(summary="Actualizar perfil parcialmente", description="Actualiza parcialmente el perfil del usuario autenticado.")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    def get_object(self):
        return self.request.user


@extend_schema(tags=['Auth'])
class ChangePasswordView(generics.UpdateAPIView):
    """
    Vista para que el usuario cambie su propia contraseña.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, IsNotBlocked]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(summary="Cambiar contraseña propia", description="Permite al usuario cambiar su propia contraseña.")
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Verificar contraseña actual
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'La contraseña actual es incorrecta.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Contraseña cambiada correctamente.'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['Auth'])
class RoleChoicesView(generics.GenericAPIView):
    """
    Vista para obtener las opciones de roles disponibles.
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(summary="Obtener roles", description="Obtiene la lista de roles disponibles en el sistema.")
    def get(self, request):
        roles = [
            {'value': choice[0], 'label': choice[1]}
            for choice in User.Role.choices
        ]
        return Response(roles)
