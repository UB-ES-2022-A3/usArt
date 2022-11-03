from cmath import log
from email import message
from http.client import HTTPResponse
from django.http import JsonResponse
from catalog.models import Publication
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required


# Create your views here.
def register(request, email, username, password):
    
    if (request.method == 'GET'):
        return JsonResponse({'resposta': 'funciona'})
    elif (request.method == 'POST'):
        # django auth hash password itself
        
        user = User.objects.create_user(username=username, email=email, password=password)
        if user != None:
            return JsonResponse({"username": username}, safe=False)
        else:
            pass        
       
    elif (request.method == 'PUT'):
        pass
    elif (request.method == 'DELETE'):
        pass

def log_in(request,username,password):
    IsLogged = False
    if (request.method == 'GET'):
        try:
            user1 = User.objects.get(username=username)
            if user1.check_password(password):# hash por defecto de django
                #token = Token.objects.create(username=username)
                login(request=request,user=user1)
                IsLogged= user1.is_authenticated
                return JsonResponse({"respuesta": "login correcto", "IsLogged": IsLogged})
            #token que devuelva que la sesion de este usuario este iniciada
            else:
                return JsonResponse({"respuesta": "El usuario o la contaseña son incorrectos", "IsLogged": IsLogged})
        except:
            
            return JsonResponse({"respuesta": "El usuario o la contaseña son incorrectos" , "IsLogged": IsLogged})
            
@login_required               
def prova(request,username):
    user1 = User.objects.get(username=username)
    if user1.is_authenticated:
        return JsonResponse({"respuesta": "true"})
        

