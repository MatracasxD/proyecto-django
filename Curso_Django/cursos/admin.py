from django.contrib import admin
from .models import Curso, ActividadesDelCurso


class CursoAdmin(admin.ModelAdmin):
    # Campos mostrados en la tabla principal
    list_display = (
        'nombre',
        'nivel',
        'duracion_horas',
        'precio',
        'estudiantes',
        'activo',
        'fecha_creacion'
    )

    # Filtros
    list_filter = (
        'nivel',
        'activo',
        'fecha_creacion'
    )

    # Búsqueda
    search_fields = (
        'nombre',
        'descripcion'
    )

    # Búsqueda por fecha
    date_hierarchy = 'fecha_creacion'

    # Solo lectura
    readonly_fields = (
        'fecha_creacion',
    )

    # Organización del formulario
    fieldsets = (
        ('Información Básica', {
            'fields': (
                'nombre',
                'descripcion',
                'imagen'
            )
        }),
        ('Detalles del Curso', {
            'fields': (
                'nivel',
                'duracion_horas',
                'precio',
                'estudiantes'
            )
        }),
        ('Estado', {
            'fields': (
                'activo',
                'fecha_creacion'
            )
        }),
    )

    actions = ['activar_cursos', 'desactivar_cursos']

    def activar_cursos(self, request, queryset):
        queryset.update(activo=True)
        self.message_user(request, "Cursos activados correctamente")

    activar_cursos.short_description = "Activar cursos seleccionados"

    def desactivar_cursos(self, request, queryset):
        queryset.update(activo=False)
        self.message_user(request, "Cursos desactivados correctamente")

    desactivar_cursos.short_description = "Desactivar cursos seleccionados"

    ordering = ('-fecha_creacion',)


class ActividadesDelCursoAdmin(admin.ModelAdmin):

    list_display = ( 'clave_actividad','nombre_curso','fecha_actividad'
    )

    list_filter = (
        'fecha_actividad',
    )

    search_fields = (
        'clave_actividad',
        'nombre_curso__nombre',
        'descripcion_actividad'
    )

    date_hierarchy = 'fecha_actividad'

    ordering = (
        '-fecha_actividad',
    )

    fieldsets = (
        ('Información de la Actividad', {
            'fields': (
                'clave_actividad',
                'nombre_curso',
                'descripcion_actividad',
                'fecha_actividad'
            )
        }),
    )


admin.site.register(Curso, CursoAdmin)
admin.site.register(ActividadesDelCurso, ActividadesDelCursoAdmin)

admin.site.site_header = "Administración de Convocatorias"
admin.site.site_title = "Admin Convocatorias"
admin.site.index_title = "Bienvenido al panel de Convocatorias"