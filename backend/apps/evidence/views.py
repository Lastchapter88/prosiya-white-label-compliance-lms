from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import FirearmEvidence, EvidenceFile, EvidenceReview
from .serializers import (
    FirearmEvidenceSerializer, 
    EvidenceFileSerializer, 
    EvidenceReviewSerializer
)

class FirearmEvidenceViewSet(viewsets.ModelViewSet):
    queryset = FirearmEvidence.objects.all()
    serializer_class = FirearmEvidenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='verify')
    def verify_evidence(self, request, pk=None):
        evidence = self.get_object()
        if not (request.user.groups.filter(name='Instructor').exists() or request.user.is_staff):
            return Response({"error": "Only instructors or staff can verify evidence"}, status=status.HTTP_403_FORBIDDEN)
            
        evidence.is_verified = True
        evidence.verified_by = request.user
        evidence.verified_at = timezone.now()
        evidence.save()
        
        serializer = self.get_serializer(evidence)
        return Response(serializer.data)

class EvidenceFileViewSet(viewsets.ModelViewSet):
    queryset = EvidenceFile.objects.all()
    serializer_class = EvidenceFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class EvidenceReviewViewSet(viewsets.ModelViewSet):
    queryset = EvidenceReview.objects.all()
    serializer_class = EvidenceReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
