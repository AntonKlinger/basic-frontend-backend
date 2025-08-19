from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from .serializers import NachrichtSerializer
from .models import Nachricht
from rest_framework import viewsets, permissions

from .models import Nachricht, Sparziel
from .serializers import NachrichtSerializer, SparzielSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Position
from .serializers import PositionSerializer

from .models import Sparrate
from .serializers import SparrateSerializer

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class NachrichtViewSet(viewsets.ModelViewSet):
    queryset = Nachricht.objects.all().order_by('-erstellt_am')
    serializer_class = NachrichtSerializer
    permission_classes = [permissions.IsAuthenticated]  # nur eingeloggte User

class SparzielView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sparziel, created = Sparziel.objects.get_or_create(user=request.user)
        serializer = SparzielSerializer(sparziel)
        return Response(serializer.data)

    def post(self, request):
        sparziel, created = Sparziel.objects.get_or_create(user=request.user)
        serializer = SparzielSerializer(sparziel, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class PositionViewSet(viewsets.ModelViewSet):
    serializer_class = PositionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Nur die Positionen des eingeloggten Users zurückgeben
        return Position.objects.filter(user=self.request.user).order_by('-erstellt_am')

    def perform_create(self, serializer):
        # Beim Erstellen automatisch den aktuellen User zuordnen
        serializer.save(user=self.request.user)

# views.py
class SparrateViewSet(viewsets.ModelViewSet):
    serializer_class = SparrateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Sparrate.objects.filter(user=self.request.user).order_by('-erstellt_am')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
