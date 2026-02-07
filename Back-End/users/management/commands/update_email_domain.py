from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Actualiza todos los correos de @uci.edu.cu a @uci.cu'

    def handle(self, *args, **options):
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("Actualizando dominio de correos..."))
        self.stdout.write("="*60 + "\n")
        
        # Obtener todos los usuarios con @uci.edu.cu
        old_users = User.objects.filter(email__endswith='@uci.edu.cu')
        
        if not old_users.exists():
            self.stdout.write(self.style.WARNING("✓ No hay usuarios con dominio @uci.edu.cu"))
            return
        
        self.stdout.write(f"Encontrados {old_users.count()} usuario(s) con @uci.edu.cu\n")
        
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
                    self.stdout.write(
                        self.style.WARNING(
                            f"⚠ Saltando {old_email} → {new_email}: "
                            f"Email ya existe"
                        )
                    )
                    skipped_count += 1
                    continue
                
                # Actualizar el correo
                user.email = new_email
                user.save()
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ {old_email} → {new_email}"
                    )
                )
                updated_count += 1
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"✗ Error al actualizar {user.email}: {str(e)}"
                    )
                )
                errors_count += 1
        
        # Resumen
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS(f"Actualizados: {updated_count}"))
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f"Saltados: {skipped_count}"))
        if errors_count > 0:
            self.stdout.write(self.style.ERROR(f"Errores: {errors_count}"))
        self.stdout.write("="*60 + "\n")
        
        # Mostrar usuarios actualizados
        self.stdout.write(self.style.HTTP_INFO("Usuarios después de la actualización:"))
        for user in User.objects.all().order_by('email'):
            role_display = user.get_role_display()
            self.stdout.write(f"  • {user.email} ({role_display})")
        
        self.stdout.write("\n" + self.style.SUCCESS("¡Actualización completada!"))
        self.stdout.write("="*60 + "\n")
