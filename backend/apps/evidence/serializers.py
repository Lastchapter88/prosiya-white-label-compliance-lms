from rest_framework import serializers
from .models import FirearmEvidence, EvidenceFile, EvidenceReview

class EvidenceFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceFile
        fields = '__all__'
        read_only_fields = ['id', 'file_hash', 'uploaded_at', 'uploaded_by']

class FirearmEvidenceSerializer(serializers.ModelSerializer):
    files = EvidenceFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = FirearmEvidence
        fields = '__all__'
        read_only_fields = ['id', 'evidence_hash', 'created_at', 'submitted_at', 'is_verified', 'verified_by', 'verified_at']

class EvidenceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceReview
        fields = '__all__'
        read_only_fields = ['id', 'reviewed_at', 'reviewer']
