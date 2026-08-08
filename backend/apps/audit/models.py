"""
Audit models for compliance-grade logging.
All actions are logged with immutable, append-only records.
"""
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import uuid
import hashlib
import json


class AuditLog(models.Model):
    """
    Immutable audit log for all system actions.
    Append-only, never delete or modify.
    """
    
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('read', 'Read'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('enroll', 'Enroll'),
        ('complete', 'Complete'),
        ('assess', 'Assess'),
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('issue', 'Issue'),
        ('download', 'Download'),
        ('upload', 'Upload'),
        ('export', 'Export'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Who
    user = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='audit_logs')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, related_name='audit_logs')
    
    # What
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, db_index=True)
    resource_type = models.CharField(max_length=100, db_index=True)
    resource_id = models.CharField(max_length=255, db_index=True)
    
    # Generic relation to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.PROTECT, null=True, blank=True)
    object_id = models.CharField(max_length=255, null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Details
    description = models.TextField()
    changes = models.JSONField(default=dict, blank=True)  # Before/after values
    metadata = models.JSONField(default=dict, blank=True)  # Additional context
    
    # When & Where
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Compliance
    hash = models.CharField(max_length=64, unique=True, editable=False)  # SHA-256
    previous_hash = models.CharField(max_length=64, null=True, blank=True)  # Chain
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['tenant', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]
        # Prevent deletion
        permissions = [
            ('view_audit_log', 'Can view audit logs'),
        ]
    
    def save(self, *args, **kwargs):
        """Generate hash before saving."""
        if not self.hash:
            # Get previous hash for chaining
            last_log = AuditLog.objects.order_by('-timestamp').first()
            self.previous_hash = last_log.hash if last_log else None
            
            # Generate hash
            data = {
                'user_id': str(self.user_id),
                'tenant_id': str(self.tenant_id),
                'action': self.action,
                'resource_type': self.resource_type,
                'resource_id': self.resource_id,
                'timestamp': self.timestamp.isoformat() if self.timestamp else None,
                'previous_hash': self.previous_hash,
            }
            hash_string = json.dumps(data, sort_keys=True)
            self.hash = hashlib.sha256(hash_string.encode()).hexdigest()
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.email} - {self.action} - {self.resource_type} - {self.timestamp}"


class ComplianceEvent(models.Model):
    """
    High-level compliance events (enrollments, certifications, assessments).
    """
    
    EVENT_TYPES = [
        ('enrollment', 'Student Enrollment'),
        ('attendance', 'Class Attendance'),
        ('assessment_start', 'Assessment Started'),
        ('assessment_complete', 'Assessment Completed'),
        ('practical_assessment', 'Practical Assessment'),
        ('evidence_upload', 'Evidence Uploaded'),
        ('certificate_issued', 'Certificate Issued'),
        ('certificate_revoked', 'Certificate Revoked'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, db_index=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT)
    user = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='compliance_events')
    
    # Event data
    event_data = models.JSONField(default=dict)
    
    # Signatures (for critical events)
    student_signature = models.TextField(blank=True)  # Digital signature
    instructor_signature = models.TextField(blank=True)
    assessor_signature = models.TextField(blank=True)
    
    # Timestamps
    event_timestamp = models.DateTimeField(db_index=True)
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    # Evidence hash
    evidence_hash = models.CharField(max_length=64, blank=True)
    
    class Meta:
        db_table = 'compliance_events'
        ordering = ['-event_timestamp']
        indexes = [
            models.Index(fields=['tenant', 'event_type', 'event_timestamp']),
            models.Index(fields=['user', 'event_timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.user.email} - {self.event_timestamp}"


class DataExport(models.Model):
    """
    Track all data exports for regulator compliance.
    """
    
    EXPORT_TYPES = [
        ('student_records', 'Student Records'),
        ('attendance', 'Attendance Records'),
        ('assessments', 'Assessment Results'),
        ('certificates', 'Certificates'),
        ('audit_logs', 'Audit Logs'),
        ('full_export', 'Full Compliance Export'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT)
    requested_by = models.ForeignKey('users.User', on_delete=models.PROTECT)
    
    export_type = models.CharField(max_length=50, choices=EXPORT_TYPES)
    filters = models.JSONField(default=dict)  # Date ranges, courses, etc.
    
    # File info
    file_path = models.CharField(max_length=500)
    file_format = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('csv', 'CSV'), ('xml', 'XML')])
    file_size = models.BigIntegerField()
    file_hash = models.CharField(max_length=64)  # SHA-256
    
    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Access tracking
    download_count = models.IntegerField(default=0)
    last_downloaded = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'data_exports'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.export_type} - {self.tenant.name} - {self.requested_at}"
