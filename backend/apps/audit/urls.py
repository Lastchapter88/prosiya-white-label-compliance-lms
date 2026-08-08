from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, ComplianceEventViewSet, DataExportViewSet

router = DefaultRouter()
router.register(r'logs', AuditLogViewSet)
router.register(r'events', ComplianceEventViewSet)
router.register(r'exports', DataExportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
