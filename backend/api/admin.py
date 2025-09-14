from django.contrib import admin
from .models import Position  # Importiere dein Modell
from .models import Nachricht
from .models import UserProfile

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'wert', 'anfangsdatum', 'enddatum')  # Spalten in der Übersicht
    list_filter = ('user', 'anfangsdatum', 'enddatum')
    search_fields = ('name',)

@admin.register(Nachricht)
class NachrichtAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'erstellt_am')  # Spalten, die angezeigt werden
    list_filter = ('erstellt_am',)                # Filter rechts im Admin
    search_fields = ('text',)                     # Suchleiste aktivieren

admin.site.register(UserProfile)