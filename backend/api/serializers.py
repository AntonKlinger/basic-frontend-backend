from rest_framework import serializers
from .models import Nachricht
from .models import Nachricht, Sparziel
from .models import Position

class NachrichtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nachricht
        fields = '__all__'

class SparzielSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sparziel
        fields = ['betrag']

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'name', 'wert', 'erstellt_am']