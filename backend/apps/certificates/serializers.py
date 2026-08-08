from rest_framework import serializers
from .models import Certificate, CertificateVerification, CertificateTemplate, RegulatorExport

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = [
            'id', 'serial_number', 'certificate_hash', 
            'created_at', 'updated_at', 'revoked_at', 
            'revoked_by', 'revocation_reason'
        ]

class CertificateVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateVerification
        fields = '__all__'
        read_only_fields = ['id', 'verified_at']

class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class RegulatorExportSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegulatorExport
        fields = '__all__'
        read_only_fields = ['id', 'requested_at', 'completed_at', 'file_path', 'file_size', 'file_hash', 'total_records']
