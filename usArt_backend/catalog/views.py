from rest_framework import generics
from catalog.models import Publication
from catalog.serializers import PublicationSerializer


class PublicationList(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer

def publicacionsuser(request,username):
    if (request.method == 'GET'):
        # Agafem la llista de DB
        try:
            if Publication.objects.get(author=username):
                publicacions = Publication.objects.filter(author = username)
                serializer = ItemSerializer(publicacions, many=True)
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