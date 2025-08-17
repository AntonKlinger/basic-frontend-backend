from django.contrib import admin
from .models import Position  # Importiere dein Modell
from .models import Nachricht

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'wert')  # Spalten in der Übersicht
    list_filter = ('user',)
    search_fields = ('name',)

@admin.register(Nachricht)
class NachrichtAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'erstellt_am')  # Spalten, die angezeigt werden
    list_filter = ('erstellt_am',)                # Filter rechts im Admin
    search_fields = ('text',)                     # Suchleiste aktivieren