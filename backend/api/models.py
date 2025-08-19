from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Nachricht(models.Model):
    text = models.TextField()
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]  # Zeigt die ersten 50 Zeichen in der Admin-Liste

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

    anfangsdatum = models.DateField(
        null=True,
        blank=True,
        default=timezone.now   # Falls leer: aktuelles Datum
    )
    enddatum = models.DateField(
        null=True,
        blank=True             # Falls leer → bleibt NULL
    )


    def __str__(self):
        return f"{self.name} - {self.wert}"
    
# models.py
class Sparrate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    betrag = models.FloatField()
    erstellt_am = models.DateTimeField(auto_now_add=True)

    anfangsdatum = models.DateField(
        null=True,
        blank=True,
        default=timezone.now
    )
    enddatum = models.DateField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.name} - {self.betrag}"
