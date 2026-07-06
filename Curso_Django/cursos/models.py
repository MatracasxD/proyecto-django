from django.db import models
from ckeditor.fields import RichTextField

# Create your models here.

class Curso(models.Model):
    NIVEL_CHOICES = [
        ('basico', 'Básico'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
    ]

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    nivel = models.CharField(max_length=20, choices=NIVEL_CHOICES, default='basico')
    imagen = models.ImageField(upload_to='cursos/', blank=True, null=True)
    duracion_horas = models.IntegerField(default=0)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estudiantes = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = "Convocatoria"
        verbose_name_plural = "Cursos"


class ActividadesDelCurso(models.Model):
    clave_actividad = models.CharField(max_length=100)

    nombre_curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name='actividades'
    )

    descripcion_actividad = RichTextField(
        config_name='default'
    )

    fecha_actividad = models.DateField()

    def __str__(self):
        return self.clave_actividad

    class Meta:
        ordering = ['fecha_actividad']
        verbose_name = "Actividad del Curso"
        verbose_name_plural = "Actividades del Curso"