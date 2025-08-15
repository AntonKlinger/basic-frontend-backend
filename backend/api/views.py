from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from .serializers import NachrichtSerializer
from .models import Nachricht
from rest_framework import viewsets, permissions

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