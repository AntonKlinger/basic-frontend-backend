from django.db import models

class Nachricht(models.Model):
    name = models.CharField(max_length=100)
    alter = models.IntegerField(null=True, blank=True)
    groesse = models.FloatField(null=True, blank=True)  # z.B. Größe in cm oder m
    erstellt_am = models.DateTimeField(auto_now_add=True)
