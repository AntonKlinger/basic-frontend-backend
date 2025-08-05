from rest_framework import serializers
from .models import Nachricht

class NachrichtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nachricht
        fields = '__all__'
