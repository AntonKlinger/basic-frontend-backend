from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NachrichtViewSet, RegisterView
from .views import SparzielView
from .views import PositionViewSet
from .views import SparrateViewSet

router = DefaultRouter()
router.register(r'nachrichten', NachrichtViewSet)
router.register(r'positionen', PositionViewSet, basename='positionen')
router.register(r'sparraten', SparrateViewSet, basename='sparraten')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('sparziel/', SparzielView.as_view(), name='sparziel'),
]
