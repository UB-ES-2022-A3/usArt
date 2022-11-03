from rest_framework import generics
from catalog.models import Publication, PublicationImage
from catalog.serializers import PublicationSerializer
from django.http import JsonResponse
from django.db.models import Q

class PublicationList(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer

def publicacionsuser(request,username):
    if (request.method == 'GET'):
        # Agafem la llista de DB
        try:
            if Publication.objects.get(author=username):
                publicacions = Publication.objects.filter(author = username)
                serializer = PublicationSerializer(publicacions, many=True)
                return JsonResponse(serializer.data, safe=False)
        except:
            
            return JsonResponse({"respuesta": "El usuario que buscas no tiene ninguna publicacion"})
    elif (request.method == 'POST'):
        pass

    elif (request.method == 'PUT'):
        pass

    elif (request.method == 'DELETE'):
        pass

class ItemDetail(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer

def items_search(request, keywords, tag):
    #keywords = keywords.split(" ")
    if (request.method == 'GET'):
        if (tag == 0):
            items = Publication.objects.filter((Q(title__icontains = keywords) | Q(description__icontains = keywords) |
                Q(author__icontains = keywords)) & Q(tag = 0))
            #items = Publication.objects.filter(reduce(operator.or_,(Q(title__icontains = x) for x in keywords)) | 
            #reduce(operator.or_,(Q(description__icontains = x) for x in keywords)) | 
            #reduce(operator.or_,(Q(author__icontains = x) for x in keywords)))
            serializer = PublicationSerializer(items, many=True)
            return JsonResponse(serializer.data, safe=False)
        elif (tag == 1):
            items = Publication.objects.filter((Q(title__icontains = keywords) | Q(description__icontains = keywords) |
                Q(author__icontains = keywords)) & Q(tag = 1))
            serializer = PublicationSerializer(items, many=True)
            return JsonResponse(serializer.data, safe=False)

        else:
            pass