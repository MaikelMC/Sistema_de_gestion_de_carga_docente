"""
Script para crear datos iniciales del sistema.
Ejecutar con: python manage.py shell < scripts/create_initial_data.py
O usar el management command: python manage.py create_initial_data
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from academic.models import Faculty, Discipline, Subject
from professors.models import Professor

User = get_user_model()


def create_admin_user():
    """Crear usuario administrador."""
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@uci.edu.cu',
            password='123456',
            first_name='Administrador',
            last_name='Sistema',
            role='ADMIN'
        )
        print(f"✓ Usuario administrador creado: {admin.username}")
        return admin
    else:
        print("! Usuario admin ya existe")
        return User.objects.get(username='admin')


def create_test_users():
    """Crear usuarios de prueba para cada rol."""
    test_users = [
        {
            'username': 'director',
            'email': 'director@uci.edu.cu',
            'password': '123456',
            'first_name': 'Director',
            'last_name': 'de Formación',
            'role': 'DIRECTOR'
        },
        {
            'username': 'vicedecano',
            'email': 'vicedecano@uci.edu.cu',
            'password': '123456',
            'first_name': 'Vicedecano',
            'last_name': 'de Formación',
            'role': 'VICEDECANO'
        },
        {
            'username': 'jefe_disciplina',
            'email': 'jefe@uci.edu.cu',
            'password': '123456',
            'first_name': 'Jefe',
            'last_name': 'de Disciplina',
            'role': 'JEFE_DISCIPLINA'
        },
        {
            'username': 'jefe_departamento',
            'email': 'depto@uci.edu.cu',
            'password': '123456',
            'first_name': 'Jefe',
            'last_name': 'de Departamento',
            'role': 'JEFE_DEPARTAMENTO'
        },
    ]
    
    created_users = []
    for user_data in test_users:
        if not User.objects.filter(username=user_data['username']).exists():
            password = user_data.pop('password')
            user = User.objects.create_user(password=password, **user_data)
            created_users.append(user)
            print(f"✓ Usuario creado: {user.username} ({user.get_role_display()})")
        else:
            print(f"! Usuario {user_data['username']} ya existe")
            created_users.append(User.objects.get(username=user_data['username']))
    
    return created_users


def run_all():
    """Ejecutar todas las funciones de creación de datos."""
    print("\n" + "="*50)
    print("Creando datos iniciales del sistema...")
    print("="*50 + "\n")
    
    print("--- Usuarios ---")
    admin = create_admin_user()
    test_users = create_test_users()
    
    print("\n" + "="*50)
    print("¡Datos iniciales creados exitosamente!")
    print("="*50)
    print("\nCredenciales de acceso (email / password):")
    print("  Admin: admin@uci.edu.cu / 123456")
    print("  Director: director@uci.edu.cu / 123456")
    print("  Vicedecano: vicedecano@uci.edu.cu / 123456")
    print("  Jefe Disciplina: jefe@uci.edu.cu / 123456")
    print("  Jefe Departamento: depto@uci.edu.cu / 123456")
    print("="*50 + "\n")


if __name__ == '__main__':
    run_all()
