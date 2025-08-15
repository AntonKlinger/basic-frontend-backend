from django.db import models
from django.contrib.auth.models import User

class Nachricht(models.Model):
    name = models.CharField(max_length=100)
    alter = models.IntegerField(null=True, blank=True)
    groesse = models.FloatField(null=True, blank=True)  # z.B. Größe in cm oder m
    erstellt_am = models.DateTimeField(auto_now_add=True)

class Sparziel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    betrag = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}: {self.betrag}"
    
class Position(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Jeder User hat eigene Positionen
    name = models.CharField(max_length=100)
    wert = models.FloatField()
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.wert}"