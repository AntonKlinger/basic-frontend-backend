from django.contrib import admin
from .models import Position  # Importiere dein Modell

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'wert')  # Spalten in der Übersicht
    list_filter = ('user',)
    search_fields = ('name',)