from rest_framework import viewsets
from .models import Nachricht
from .serializers import NachrichtSerializer

class NachrichtViewSet(viewsets.ModelViewSet):
    queryset = Nachricht.objects.all().order_by('-erstellt_am')
    serializer_class = NachrichtSerializer