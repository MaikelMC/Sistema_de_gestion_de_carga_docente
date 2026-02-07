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
print("Actualizando dominio de correos...")
print("="*60 + "\n")

# Obtener todos los usuarios con @uci.edu.cu
old_users = User.objects.filter(email__endswith='@uci.edu.cu')

if not old_users.exists():
    print("✓ No hay usuarios con dominio @uci.edu.cu")
    sys.exit(0)

print(f"Encontrados {old_users.count()} usuario(s) con @uci.edu.cu\n")

updated_count = 0
skipped_count = 0
errors_count = 0

for user in old_users:
    try:
        old_email = user.email
        # Reemplazar @uci.edu.cu con @uci.cu
        new_email = old_email.replace('@uci.edu.cu', '@uci.cu')
        
        # Verificar si el nuevo email ya existe
        if User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
            print(f"⚠ Saltando {old_email} → {new_email}: Email ya existe")
            skipped_count += 1
            continue
        
        # Actualizar el correo
        user.email = new_email
        user.save()
        
        print(f"✓ {old_email} → {new_email}")
        updated_count += 1
        
    except Exception as e:
        print(f"✗ Error al actualizar {user.email}: {str(e)}")
        errors_count += 1

# Resumen
print("\n" + "="*60)
print(f"Actualizados: {updated_count}")
if skipped_count > 0:
    print(f"Saltados: {skipped_count}")
if errors_count > 0:
    print(f"Errores: {errors_count}")
print("="*60 + "\n")

# Mostrar usuarios actualizados
print("Usuarios después de la actualización:")
for user in User.objects.all().order_by('email'):
    role_display = user.get_role_display()
    print(f"  • {user.email} ({role_display})")

print("\n" + "="*60)
print("¡Actualización completada!")
print("="*60 + "\n")
