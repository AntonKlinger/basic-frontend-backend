from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NachrichtViewSet, RegisterView
from .views import SparzielView
from .views import PositionViewSet

router = DefaultRouter()
router.register(r'nachrichten', NachrichtViewSet)
router.register(r'positionen', PositionViewSet, basename='positionen')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('sparziel/', SparzielView.as_view(), name='sparziel'),
]
