from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Certificate, CertificateVerification, CertificateTemplate, RegulatorExport
from .serializers import (
    CertificateSerializer, 
    CertificateVerificationSerializer, 
    CertificateTemplateSerializer, 
    RegulatorExportSerializer
)

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='revoke')
    def revoke_certificate(self, request, pk=None):
        certificate = self.get_object()
        if not request.user.is_staff:
            return Response({"error": "Only staff can revoke certificates"}, status=status.HTTP_403_FORBIDDEN)
            
        certificate.status = 'revoked'
        certificate.revoked_at = timezone.now()
        certificate.revoked_by = request.user
        certificate.revocation_reason = request.data.get('reason', 'No reason provided')
        certificate.save()
        
        serializer = self.get_serializer(certificate)
        return Response(serializer.data)

class CertificateVerificationViewSet(viewsets.ModelViewSet):
    queryset = CertificateVerification.objects.all()
    serializer_class = CertificateVerificationSerializer
    permission_classes = [permissions.AllowAny] # Verification should be public

    def perform_create(self, serializer):
        # Add IP and User if authenticated
        ip = self.request.META.get('REMOTE_ADDR')
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(verified_by_ip=ip, verified_by_user=user)

class CertificateTemplateViewSet(viewsets.ModelViewSet):
    queryset = CertificateTemplate.objects.all()
    serializer_class = CertificateTemplateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class RegulatorExportViewSet(viewsets.ModelViewSet):
    queryset = RegulatorExport.objects.all()
    serializer_class = RegulatorExportSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)
