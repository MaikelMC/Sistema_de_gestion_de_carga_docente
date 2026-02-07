from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permiso que solo permite acceso a administradores.
    """
    message = 'Solo los administradores pueden realizar esta acción.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsDirector(permissions.BasePermission):
    """
    Permiso que solo permite acceso a directores.
    """
    message = 'Solo los directores pueden realizar esta acción.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_director


class IsVicedecano(permissions.BasePermission):
    """
    Permiso que solo permite acceso a vicedecanos.
    """
    message = 'Solo los vicedecanos pueden realizar esta acción.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_vicedecano


class IsJefeDisciplina(permissions.BasePermission):
    """
    Permiso que solo permite acceso a jefes de disciplina.
    """
    message = 'Solo los jefes de disciplina pueden realizar esta acción.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_jefe_disciplina


class IsJefeDepartamento(permissions.BasePermission):
    """
    Permiso que solo permite acceso a jefes de departamento.
    """
    message = 'Solo los jefes de departamento pueden realizar esta acción.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_jefe_departamento


class CanManageUsers(permissions.BasePermission):
    """
    Permiso para gestionar usuarios (solo admin).
    """
    message = 'No tiene permisos para gestionar usuarios.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.can_manage_users()


class CanAddProfessors(permissions.BasePermission):
    """
    Permiso para agregar profesores.
    """
    message = 'No tiene permisos para agregar profesores.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.can_add_professors()


class CanDownloadReports(permissions.BasePermission):
    """
    Permiso para descargar reportes CSV/Excel.
    """
    message = 'No tiene permisos para descargar reportes.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.can_download_reports()


class CanViewComments(permissions.BasePermission):
    """
    Permiso para ver comentarios.
    """
    message = 'No tiene permisos para ver comentarios.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.can_view_comments()


class CanModifyAssignments(permissions.BasePermission):
    """
    Permiso para modificar asignaciones.
    """
    message = 'No tiene permisos para modificar asignaciones.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.can_modify_assignments()


class IsNotBlocked(permissions.BasePermission):
    """
    Verifica que el usuario no esté bloqueado.
    """
    message = 'Su cuenta está bloqueada. Contacte al administrador.'
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_blocked


class ReadOnlyOrAdmin(permissions.BasePermission):
    """
    Permite lectura a todos los autenticados, escritura solo a admins.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_admin


class CanManageAcademic(permissions.BasePermission):
    """
    Permiso para gestionar datos académicos (facultades, disciplinas, asignaturas).
    Solo admin y vicedecano pueden gestionar.
    """
    message = 'No tiene permisos para gestionar datos académicos.'
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and (
            request.user.is_admin or request.user.is_vicedecano
        )
