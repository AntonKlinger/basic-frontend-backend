from django.db import models

class Nachricht(models.Model):
    inhalt = models.TextField()
    erstellt_am = models.DateTimeField(auto_now_add=True)
