from rest_framework import serializers
from .models import AuditLog, ComplianceEvent, DataExport

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        read_only_fields = ['id', 'timestamp', 'hash', 'previous_hash']

class ComplianceEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceEvent
        fields = '__all__'
        read_only_fields = ['id', 'recorded_at']

class DataExportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataExport
        fields = '__all__'
        read_only_fields = ['id', 'requested_at', 'completed_at', 'file_path', 'file_size', 'file_hash', 'download_count', 'last_downloaded']
