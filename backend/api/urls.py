from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NachrichtViewSet, RegisterView

router = DefaultRouter()
router.register(r'nachrichten', NachrichtViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
]
