from rest_framework.routers import DefaultRouter
from .views import NachrichtViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'nachrichten', NachrichtViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
