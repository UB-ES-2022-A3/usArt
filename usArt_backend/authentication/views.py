from authentication.models import UsArtUser
from django.http import JsonResponse
from catalog.models import Publication
from rest_framework.parsers import JSONParser
from django.contrib import messages
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from authentication.models import UsArtUser
from authentication.serializers import UsArtUserSerializer
from rest_framework import generics
from django.core.validators import RegexValidator
import re

# Create your views here.
def register(request, email, username, password):
    
    if (request.method == 'GET'):
        pass
    elif (request.method == 'POST'):
        # django auth hash password itself
        if (not re.search(r"^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$", email)):
            return JsonResponse({"response": "the email is not valid"})
        if (not re.search(r"^[a-zA-Z0-9.\$]{3,30}$", username)):
            return JsonResponse({"response": "the username is not valid"})
        if not (re.search(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\.-_!@#\$%\^&\*])(?=.{7,})", password)):
            return JsonResponse({"response": "the password is not valid"})
        try:
            user = UsArtUser.objects.create_user(user_name=username, email=email, password=password)
        except:
            if (UsArtUser.objects.filter(user_name = username).exists() & UsArtUser.objects.filter(email = email).exists()):
                return JsonResponse({"response": "the username and email already exist"})
            elif (UsArtUser.objects.filter(user_name = username).exists()):
                return JsonResponse({"response": "the username already exist"})
            elif (UsArtUser.objects.filter(email = email).exists()):
                return JsonResponse({"response": "the email already exist"})
            else:
                return JsonResponse({"response": "cannot create user"})
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
            user1 = UsArtUser.objects.get(user_name=username)
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
    user1 = UsArtUser.objects.get(user_name=username)
    if user1.is_authenticated:
        return JsonResponse({"respuesta": "true"})


class UsArtUserDetail(generics.RetrieveAPIView):
    queryset = UsArtUser.objects.all()
    serializer_class = UsArtUserSerializer()
        

