from django.shortcuts import render
from cursos.models import Curso

menu= """ 
   <a href="/">Principal</a>
   <a href="/contacto/">Contacto</a>
   <a href="/cursos/">Cursos</a>

"""

# Create your views here.

def principal(request):
    return render(request,'contenido/principal.html')

def contacto(request):
    return render(request,'contenido/contacto.html')

def cursos(request):
    cursos_list = Curso.objects.all()
    return render(request,'contenido/cursos.html', {'cursos': cursos_list})