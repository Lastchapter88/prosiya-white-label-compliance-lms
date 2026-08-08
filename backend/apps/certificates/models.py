"""
Certificate models for course completion and compliance.
"""
from django.db import models
import uuid
import secrets
import hashlib


def generate_certificate_serial():
    """Generate unique certificate serial number."""
    return f"CERT-{secrets.token_hex(8).upper()}"


class Certificate(models.Model):
    """
    Digital certificate issued upon course completion.
    """
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked'),
        ('suspended', 'Suspended'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Unique serial number
    serial_number = models.CharField(max_length=50, unique=True, default=generate_certificate_serial, db_index=True)
    
    # Who
    student = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='certificates')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT)
    
    # What
    course = models.ForeignKey('courses.Course', on_delete=models.PROTECT)
    enrollment = models.OneToOneField('courses.Enrollment', on_delete=models.PROTECT)
    
    # Certificate details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Compliance codes
    psira_code = models.CharField(max_length=50, blank=True)
    qcto_code = models.CharField(max_length=50, blank=True)
    sasseta_code = models.CharField(max_length=50, blank=True)
    
    # Validity
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', db_index=True)
    
    # Files
    pdf_file = models.FileField(upload_to='certificates/', null=True, blank=True)
    qr_code_image = models.ImageField(upload_to='certificate_qr/', null=True, blank=True)
    
    # Verification
    verification_url = models.URLField(blank=True)
    certificate_hash = models.CharField(max_length=64, unique=True)  # SHA-256
    
    # Signatures
    issued_by = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='issued_certificates')
    digital_signature = models.TextField(blank=True)
    
    # Revocation
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='revoked_certificates')
    revocation_reason = models.TextField(blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'certificates'
        ordering = ['-issue_date']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['serial_number']),
            models.Index(fields=['expiry_date', 'status']),
        ]
    
    def save(self, *args, **kwargs):
        """Generate certificate hash before saving."""
        if not self.certificate_hash:
            data = f"{self.serial_number}{self.student_id}{self.course_id}{self.issue_date}"
            self.certificate_hash = hashlib.sha256(data.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.serial_number} - {self.student.get_full_name()} - {self.course.title}"
    
    @property
    def is_valid(self):
        """Check if certificate is currently valid."""
        if self.status != 'active':
            return False
        if self.expiry_date:
            from django.utils import timezone
            return self.expiry_date >= timezone.now().date()
        return True


class CertificateVerification(models.Model):
    """
    Track certificate verification attempts.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='verifications')
    
    # Verification details
    verified_by_ip = models.GenericIPAddressField()
    verified_by_user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Method
    verification_method = models.CharField(max_length=50, choices=[
        ('qr_code', 'QR Code Scan'),
        ('serial_number', 'Serial Number Lookup'),
        ('api', 'API Request'),
    ])
    
    # Result
    was_valid = models.BooleanField()
    
    verified_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'certificate_verifications'
        ordering = ['-verified_at']
    
    def __str__(self):
        return f"{self.certificate.serial_number} - {self.verified_at}"


class CertificateTemplate(models.Model):
    """
    Certificate design templates for tenants.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='certificate_templates')
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Design
    background_image = models.ImageField(upload_to='certificate_templates/')
    logo_image = models.ImageField(upload_to='certificate_templates/', null=True, blank=True)
    
    # Layout (JSON with positioning)
    layout_config = models.JSONField(default=dict)  # {student_name: {x, y, font, size}, ...}
    
    # Styling
    primary_color = models.CharField(max_length=7, default='#000000')
    secondary_color = models.CharField(max_length=7, default='#666666')
    font_family = models.CharField(max_length=100, default='Arial')
    
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'certificate_templates'
        ordering = ['tenant', 'name']
    
    def __str__(self):
        return f"{self.tenant.name} - {self.name}"


class RegulatorExport(models.Model):
    """
    Export packages for regulators (PSIRA, QCTO, SASSETA).
    """
    
    REGULATOR_CHOICES = [
        ('psira', 'PSIRA'),
        ('qcto', 'QCTO'),
        ('sasseta', 'SASSETA'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('csv', 'CSV'),
        ('xml', 'XML'),
        ('zip', 'ZIP Archive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT)
    regulator = models.CharField(max_length=20, choices=REGULATOR_CHOICES)
    
    # Export scope
    start_date = models.DateField()
    end_date = models.DateField()
    courses = models.ManyToManyField('courses.Course', blank=True)
    
    # Included data
    include_certificates = models.BooleanField(default=True)
    include_assessments = models.BooleanField(default=True)
    include_attendance = models.BooleanField(default=True)
    include_evidence = models.BooleanField(default=False)
    
    # File
    export_format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    file_path = models.CharField(max_length=500)
    file_size = models.BigIntegerField()
    file_hash = models.CharField(max_length=64)
    
    # Metadata
    total_records = models.IntegerField(default=0)
    
    # Audit
    requested_by = models.ForeignKey('users.User', on_delete=models.PROTECT)
    requested_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'regulator_exports'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.regulator} Export - {self.tenant.name} - {self.requested_at.date()}"
