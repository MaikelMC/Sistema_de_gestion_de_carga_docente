from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from academic.models import Faculty, Discipline, Subject
from professors.models import Professor

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea datos iniciales para el sistema'

    def handle(self, *args, **options):
        self.stdout.write("\n" + "="*50)
        self.stdout.write(self.style.SUCCESS("Creando datos iniciales del sistema..."))
        self.stdout.write("="*50 + "\n")
        
        # Crear usuarios
        self.stdout.write(self.style.HTTP_INFO("--- Usuarios ---"))
        admin = self.create_admin_user()
        test_users = self.create_test_users()
        jefe = next((u for u in test_users if u.role == 'JEFE_DISCIPLINA'), None)
        
        self.stdout.write("\n" + self.style.HTTP_INFO("--- Facultades ---"))
        faculties = self.create_faculties()
        
        self.stdout.write("\n" + self.style.HTTP_INFO("--- Disciplinas ---"))
        disciplines = self.create_disciplines(jefe)
        
        self.stdout.write("\n" + self.style.HTTP_INFO("--- Asignaturas ---"))
        subjects = self.create_subjects(disciplines)
        
        self.stdout.write("\n" + self.style.HTTP_INFO("--- Profesores ---"))
        professors = self.create_professors(jefe)
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write(self.style.SUCCESS("¡Datos iniciales creados exitosamente!"))
        self.stdout.write("="*50)
        self.stdout.write("\nCredenciales de acceso:")
        self.stdout.write("  Admin: admin@uci.edu.cu / 123456")
        self.stdout.write("  Director: director@uci.edu.cu / 123456")
        self.stdout.write("  Vicedecano: vicedecano@uci.edu.cu / 123456")
        self.stdout.write("  Jefe Disciplina: jefe@uci.edu.cu / 123456")
        self.stdout.write("  Jefe Departamento: depto@uci.edu.cu / 123456")
        self.stdout.write("="*50 + "\n")

    def create_admin_user(self):
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
            self.stdout.write(self.style.SUCCESS(f"✓ Usuario administrador creado: {admin.username}"))
            return admin
        else:
            self.stdout.write(self.style.WARNING("! Usuario admin ya existe"))
            return User.objects.get(username='admin')

    def create_test_users(self):
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
                self.stdout.write(self.style.SUCCESS(f"✓ Usuario creado: {user.username} ({user.get_role_display()})"))
            else:
                self.stdout.write(self.style.WARNING(f"! Usuario {user_data['username']} ya existe"))
                created_users.append(User.objects.get(username=user_data['username']))
        
        return created_users

    def create_faculties(self):
        """Crear facultades de la UCI."""
        faculties_data = [
            {'name': 'Facultad de Tecnologías Libres', 'code': 'FTL'},
            {'name': 'Facultad de Tecnologías Interactivas', 'code': 'FTI'},
            {'name': 'Facultad de Tecnologías Educativas', 'code': 'FTE'},
            {'name': 'Facultad de Informática Organizacional', 'code': 'FIO'},
            {'name': 'Facultad de Ciencias y Tecnologías Computacionales', 'code': 'FCTC'},
            {'name': 'Facultad de Ciberseguridad', 'code': 'FCS'},
        ]
        
        created = []
        for data in faculties_data:
            faculty, was_created = Faculty.objects.get_or_create(
                code=data['code'],
                defaults=data
            )
            if was_created:
                self.stdout.write(self.style.SUCCESS(f"✓ Facultad creada: {faculty.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"! Facultad {faculty.name} ya existe"))
            created.append(faculty)
        
        return created

    def create_disciplines(self, jefe_user=None):
        """Crear disciplinas de la UCI."""
        disciplines_data = [
            {'name': 'Educación Física', 'code': 'EF', 'description': 'Disciplina de Educación Física'},
            {'name': 'Inteligencia Computacional', 'code': 'IC', 'description': 'Disciplina de Inteligencia Computacional'},
            {'name': 'Sistemas Digitales', 'code': 'SD', 'description': 'Disciplina de Sistemas Digitales'},
            {'name': 'Matemática', 'code': 'MAT', 'description': 'Disciplina de Matemática'},
            {'name': 'Física', 'code': 'FIS', 'description': 'Disciplina de Física'},
            {'name': 'Práctica Profesional', 'code': 'PP', 'description': 'Disciplina de Práctica Profesional'},
            {'name': 'Técnicas de Programación de Computadoras', 'code': 'TPC', 'description': 'Disciplina de Técnicas de Programación'},
            {'name': 'Ingeniería y Gestión de Software', 'code': 'IGS', 'description': 'Disciplina de Ingeniería y Gestión de Software'},
            {'name': 'Gestión Organizacional', 'code': 'GO', 'description': 'Disciplina de Gestión Organizacional'},
            {'name': 'Preparación para la Defensa', 'code': 'PD', 'description': 'Disciplina de Preparación para la Defensa'},
            {'name': 'Marxismo Leninismo', 'code': 'ML', 'description': 'Disciplina de Marxismo Leninismo'},
            {'name': 'Historia de Cuba', 'code': 'HC', 'description': 'Disciplina de Historia de Cuba'},
            {'name': 'Idioma Extranjero', 'code': 'IE', 'description': 'Disciplina de Idioma Extranjero'},
        ]
        
        created = []
        for data in disciplines_data:
            if jefe_user:
                data['head'] = jefe_user
            discipline, was_created = Discipline.objects.get_or_create(
                code=data['code'],
                defaults=data
            )
            if was_created:
                self.stdout.write(self.style.SUCCESS(f"✓ Disciplina creada: {discipline.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"! Disciplina {discipline.name} ya existe"))
            created.append(discipline)
        
        return created

    def create_subjects(self, disciplines):
        """Crear asignaturas de la UCI."""
        subjects_data = {
            'PP': [
                {'name': 'ICI1', 'code': 'PP01', 'semester': 1, 'year': 1, 'hours_per_week': 4},
                {'name': 'ICI2', 'code': 'PP02', 'semester': 2, 'year': 1, 'hours_per_week': 4},
                {'name': 'PID1', 'code': 'PP03', 'semester': 1, 'year': 2, 'hours_per_week': 4},
                {'name': 'PID2', 'code': 'PP04', 'semester': 2, 'year': 2, 'hours_per_week': 4},
                {'name': 'PID3', 'code': 'PP05', 'semester': 1, 'year': 3, 'hours_per_week': 4},
                {'name': 'PID4', 'code': 'PP06', 'semester': 2, 'year': 3, 'hours_per_week': 4},
                {'name': 'PID5', 'code': 'PP07', 'semester': 1, 'year': 4, 'hours_per_week': 4},
                {'name': 'MIC', 'code': 'PP08', 'semester': 2, 'year': 4, 'hours_per_week': 4},
            ],
            'TPC': [
                {'name': 'IP1', 'code': 'TPC01', 'semester': 1, 'year': 1, 'hours_per_week': 4},
                {'name': 'IP2', 'code': 'TPC02', 'semester': 2, 'year': 1, 'hours_per_week': 4},
                {'name': 'ED1', 'code': 'TPC03', 'semester': 1, 'year': 2, 'hours_per_week': 4},
                {'name': 'ED2', 'code': 'TPC04', 'semester': 2, 'year': 2, 'hours_per_week': 4},
                {'name': 'Pweb', 'code': 'TPC05', 'semester': 1, 'year': 3, 'hours_per_week': 3},
            ],
            'IGS': [
                {'name': 'SBD1', 'code': 'IGS01', 'semester': 1, 'year': 2, 'hours_per_week': 3},
                {'name': 'SBD2', 'code': 'IGS02', 'semester': 2, 'year': 2, 'hours_per_week': 3},
                {'name': 'ISW1', 'code': 'IGS03', 'semester': 1, 'year': 3, 'hours_per_week': 4},
                {'name': 'ISW2', 'code': 'IGS04', 'semester': 2, 'year': 3, 'hours_per_week': 4},
                {'name': 'GPI', 'code': 'IGS05', 'semester': 1, 'year': 4, 'hours_per_week': 3},
            ],
            'ML': [
                {'name': 'Filosofía', 'code': 'ML01', 'semester': 1, 'year': 1, 'hours_per_week': 2},
                {'name': 'EP', 'code': 'ML02', 'semester': 2, 'year': 1, 'hours_per_week': 2},
                {'name': 'TP', 'code': 'ML03', 'semester': 1, 'year': 2, 'hours_per_week': 2},
                {'name': 'ECTS', 'code': 'ML04', 'semester': 2, 'year': 2, 'hours_per_week': 2},
            ],
            'HC': [
                {'name': 'Historia de Cuba', 'code': 'HC01', 'semester': 1, 'year': 1, 'hours_per_week': 2},
            ],
            'IC': [
                {'name': 'MD1', 'code': 'IC01', 'semester': 1, 'year': 2, 'hours_per_week': 3},
                {'name': 'MD2', 'code': 'IC02', 'semester': 2, 'year': 2, 'hours_per_week': 3},
                {'name': 'PE', 'code': 'IC03', 'semester': 1, 'year': 3, 'hours_per_week': 3},
                {'name': 'IO', 'code': 'IC04', 'semester': 2, 'year': 3, 'hours_per_week': 3},
                {'name': 'IA', 'code': 'IC05', 'semester': 1, 'year': 4, 'hours_per_week': 3},
                {'name': 'AA', 'code': 'IC06', 'semester': 2, 'year': 4, 'hours_per_week': 3},
            ],
            'GO': [
                {'name': 'FAGO', 'code': 'GO01', 'semester': 1, 'year': 3, 'hours_per_week': 2},
                {'name': 'GPN', 'code': 'GO02', 'semester': 2, 'year': 3, 'hours_per_week': 2},
            ],
            'SD': [
                {'name': 'AC', 'code': 'SD01', 'semester': 1, 'year': 2, 'hours_per_week': 3},
                {'name': 'SO', 'code': 'SD02', 'semester': 2, 'year': 2, 'hours_per_week': 3},
                {'name': 'RSI1', 'code': 'SD03', 'semester': 1, 'year': 3, 'hours_per_week': 3},
                {'name': 'RSI2', 'code': 'SD04', 'semester': 2, 'year': 3, 'hours_per_week': 3},
            ],
            'MAT': [
                {'name': 'Álgebra', 'code': 'MAT01', 'semester': 1, 'year': 1, 'hours_per_week': 4},
                {'name': 'M1', 'code': 'MAT02', 'semester': 2, 'year': 1, 'hours_per_week': 4},
                {'name': 'M2', 'code': 'MAT03', 'semester': 1, 'year': 2, 'hours_per_week': 3},
                {'name': 'M3', 'code': 'MAT04', 'semester': 2, 'year': 2, 'hours_per_week': 3},
            ],
            'FIS': [
                {'name': 'Física', 'code': 'FIS01', 'semester': 1, 'year': 2, 'hours_per_week': 3},
            ],
            'EF': [
                {'name': 'EF1', 'code': 'EF01', 'semester': 1, 'year': 1, 'hours_per_week': 2},
                {'name': 'EF2', 'code': 'EF02', 'semester': 2, 'year': 1, 'hours_per_week': 2},
                {'name': 'EF3', 'code': 'EF03', 'semester': 1, 'year': 2, 'hours_per_week': 2},
                {'name': 'EF4', 'code': 'EF04', 'semester': 2, 'year': 2, 'hours_per_week': 2},
            ],
        }
        
        created = []
        for discipline in disciplines:
            if discipline.code in subjects_data:
                for subject_data in subjects_data[discipline.code]:
                    subject_data['discipline'] = discipline
                    subject, was_created = Subject.objects.get_or_create(
                        code=subject_data['code'],
                        defaults=subject_data
                    )
                    if was_created:
                        self.stdout.write(self.style.SUCCESS(f"✓ Asignatura creada: {subject.name}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"! Asignatura {subject.name} ya existe"))
                    created.append(subject)
        
        return created

    def create_professors(self, created_by=None):
        """Crear profesores de ejemplo."""
        professors_data = [
            {
                'first_name': 'Juan',
                'last_name': 'Pérez García',
                'email': 'jperez@uci.edu.cu',
                'identification': '85010112345',
                'category': 'TITULAR',
                'scientific_degree': 'DR',
                'contract_type': 'FULL_TIME',
                'specialty': 'Técnicas de Programación de Computadoras',
                'years_of_experience': 15
            },
            {
                'first_name': 'Laura',
                'last_name': 'Fernández Ruiz',
                'email': 'lfernandez@uci.edu.cu',
                'identification': '90050567890',
                'category': 'AUXILIAR',
                'scientific_degree': 'MSC',
                'contract_type': 'FULL_TIME',
                'specialty': 'Matemática',
                'years_of_experience': 8
            },
            {
                'first_name': 'Roberto',
                'last_name': 'Sánchez Díaz',
                'email': 'rsanchez@uci.edu.cu',
                'identification': '88030398765',
                'category': 'ASISTENTE',
                'scientific_degree': 'MSC',
                'contract_type': 'FULL_TIME',
                'specialty': 'Ingeniería y Gestión de Software',
                'years_of_experience': 5
            },
            {
                'first_name': 'Carmen',
                'last_name': 'Torres Vega',
                'email': 'ctorres@uci.edu.cu',
                'identification': '92080845678',
                'category': 'INSTRUCTOR',
                'scientific_degree': 'NONE',
                'contract_type': 'PART_TIME',
                'specialty': 'Inteligencia Computacional',
                'years_of_experience': 2
            },
        ]
        
        created = []
        for data in professors_data:
            if created_by:
                data['created_by'] = created_by
            professor, was_created = Professor.objects.get_or_create(
                identification=data['identification'],
                defaults=data
            )
            if was_created:
                self.stdout.write(self.style.SUCCESS(f"✓ Profesor creado: {professor.full_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"! Profesor {professor.full_name} ya existe"))
            created.append(professor)
        
        return created
