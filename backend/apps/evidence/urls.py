from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirearmEvidenceViewSet, EvidenceFileViewSet, EvidenceReviewViewSet

router = DefaultRouter()
router.register(r'firearm', FirearmEvidenceViewSet)
router.register(r'files', EvidenceFileViewSet)
router.register(r'reviews', EvidenceReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
