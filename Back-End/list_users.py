#!/usr/bin/env python
import os
import django
import sys

# Configurar Django
sys.path.insert(0, r'C:\Users\Maikel De Arma\Desktop\Ptojects\Sistema de gestion de carga docente\Back-End')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*60)
print("Listado de todos los usuarios en la BD")
print("="*60 + "\n")

users = User.objects.all().order_by('email')

if not users.exists():
    print("✓ No hay usuarios en la BD")
else:
    print(f"Total de usuarios: {users.count()}\n")
    for user in users:
        role_display = user.get_role_display()
        is_active = "✓" if user.is_active else "✗"
        is_blocked = "(Bloqueado)" if user.is_blocked else ""
        print(f"  {is_active} {user.email} ({role_display}) {is_blocked}")

print("\n" + "="*60)

# Estadísticas
old_domain_count = User.objects.filter(email__endswith='@uci.edu.cu').count()
new_domain_count = User.objects.filter(email__endswith='@uci.cu').count()

print(f"Usuarios con @uci.edu.cu: {old_domain_count}")
print(f"Usuarios con @uci.cu: {new_domain_count}")
print("="*60 + "\n")
