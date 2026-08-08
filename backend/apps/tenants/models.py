"""
Tenant models for white-label multi-tenancy.
"""
from django.db import models
import uuid


class Tenant(models.Model):
    """
    Represents an academy/organization using the LMS.
    ProSiya is the first tenant, others can be added later.
    """
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('trial', 'Trial'),
        ('inactive', 'Inactive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    
    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True)
    
    # Address
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='South Africa')
    
    # Registration details
    registration_number = models.CharField(max_length=100, unique=True)
    tax_number = models.CharField(max_length=100, blank=True)
    
    # Accreditation
    psira_accreditation = models.CharField(max_length=100, blank=True)
    qcto_accreditation = models.CharField(max_length=100, blank=True)
    sasseta_accreditation = models.CharField(max_length=100, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    is_active = models.BooleanField(default=True)
    
    # Subscription
    subscription_start = models.DateField(null=True, blank=True)
    subscription_end = models.DateField(null=True, blank=True)
    max_students = models.IntegerField(default=100)
    max_instructors = models.IntegerField(default=10)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenants'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class TenantTheme(models.Model):
    """
    Branding and theming configuration for each tenant.
    """
    
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='theme')
    
    # Colors (hex codes)
    primary_color = models.CharField(max_length=7, default='#1a56db')
    secondary_color = models.CharField(max_length=7, default='#7e3af2')
    accent_color = models.CharField(max_length=7, default='#f59e0b')
    
    # Logos
    logo_light = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    logo_dark = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    favicon = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    
    # Certificate branding
    certificate_background = models.ImageField(upload_to='certificate_templates/', null=True, blank=True)
    certificate_logo = models.ImageField(upload_to='certificate_templates/', null=True, blank=True)
    
    # Custom CSS (optional)
    custom_css = models.TextField(blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenant_themes'
    
    def __str__(self):
        return f"Theme: {self.tenant.name}"


class TenantSettings(models.Model):
    """
    Operational settings for each tenant.
    """
    
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='settings')
    
    # Features
    enable_live_sessions = models.BooleanField(default=True)
    enable_practical_assessments = models.BooleanField(default=True)
    enable_payments = models.BooleanField(default=True)
    enable_certificates = models.BooleanField(default=True)
    
    # Compliance
    require_id_verification = models.BooleanField(default=True)
    require_biometric_attendance = models.BooleanField(default=False)
    enable_evidence_hashing = models.BooleanField(default=True)
    
    # Notifications
    admin_email = models.EmailField()
    notification_emails = models.JSONField(default=list)
    
    # Custom settings (JSON)
    custom_settings = models.JSONField(default=dict, blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'tenant_settings'
    
    def __str__(self):
        return f"Settings: {self.tenant.name}"
