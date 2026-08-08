from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import AuditLog, ComplianceEvent, DataExport
from .serializers import (
    AuditLogSerializer, 
    ComplianceEventSerializer, 
    DataExportSerializer
)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit logs are read-only for compliance.
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get_queryset(self):
        # Filtering by tenant or user could be added here
        return AuditLog.objects.all()

class ComplianceEventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Compliance events are read-only for compliance.
    """
    queryset = ComplianceEvent.objects.all()
    serializer_class = ComplianceEventSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class DataExportViewSet(viewsets.ModelViewSet):
    queryset = DataExport.objects.all()
    serializer_class = DataExportSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)
