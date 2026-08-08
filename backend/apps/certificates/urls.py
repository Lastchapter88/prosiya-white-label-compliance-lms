from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CertificateViewSet, 
    CertificateVerificationViewSet, 
    CertificateTemplateViewSet, 
    RegulatorExportViewSet
)

router = DefaultRouter()
router.register(r'list', CertificateViewSet)
router.register(r'verify', CertificateVerificationViewSet)
router.register(r'templates', CertificateTemplateViewSet)
router.register(r'exports', RegulatorExportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
