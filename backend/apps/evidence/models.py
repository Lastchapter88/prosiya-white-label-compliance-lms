"""
Evidence models for firearm training and practical assessments.
Court-grade evidence with immutable records.
"""
from django.db import models
import uuid
import hashlib


class FirearmEvidence(models.Model):
    """
    Evidence of firearm handling and training.
    Immutable once submitted.
    """
    
    EVIDENCE_TYPES = [
        ('range_session', 'Range Session'),
        ('competency_test', 'Competency Test'),
        ('renewal', 'Renewal'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Who
    student = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='firearm_evidence')
    instructor = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='supervised_firearm_evidence')
    assessor = models.ForeignKey('users.User', on_delete=models.PROTECT, null=True, blank=True, related_name='assessed_firearm_evidence')
    
    # Course
    course = models.ForeignKey('courses.Course', on_delete=models.PROTECT)
    practical_assessment = models.ForeignKey('assessments.PracticalAssessment', on_delete=models.PROTECT, null=True, blank=True)
    
    # What
    evidence_type = models.CharField(max_length=50, choices=EVIDENCE_TYPES)
    
    # Learner identification
    learner_id_number = models.CharField(max_length=13)
    learner_photo = models.ImageField(upload_to='evidence/learner_photos/')
    
    # Firearm details
    firearm_make = models.CharField(max_length=100)
    firearm_model = models.CharField(max_length=100)
    firearm_caliber = models.CharField(max_length=50)
    firearm_serial_number = models.CharField(max_length=100)
    
    # Location
    range_name = models.CharField(max_length=255)
    range_address = models.TextField()
    range_license_number = models.CharField(max_length=100, blank=True)
    
    # When
    session_date = models.DateField()
    session_start_time = models.TimeField()
    session_end_time = models.TimeField()
    
    # Evidence files
    photo_evidence = models.JSONField(default=list)  # List of photo URLs/paths
    video_evidence = models.JSONField(default=list)  # List of video URLs/paths
    
    # Performance
    rounds_fired = models.IntegerField(default=0)
    target_distance_meters = models.DecimalField(max_digits=5, decimal_places=2)
    accuracy_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    competency_achieved = models.BooleanField(default=False)
    
    # Signatures (digital)
    student_signature = models.TextField()
    instructor_signature = models.TextField()
    assessor_signature = models.TextField(blank=True)
    
    # Notes
    instructor_notes = models.TextField(blank=True)
    assessor_notes = models.TextField(blank=True)
    
    # Compliance
    evidence_hash = models.CharField(max_length=64, unique=True, editable=False)  # SHA-256
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_firearm_evidence')
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Audit
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'firearm_evidence'
        ordering = ['-session_date', '-session_start_time']
        indexes = [
            models.Index(fields=['student', 'session_date']),
            models.Index(fields=['instructor', 'session_date']),
            models.Index(fields=['firearm_serial_number']),
        ]
    
    def save(self, *args, **kwargs):
        """Generate evidence hash before saving."""
        if not self.evidence_hash:
            data = f"{self.student_id}{self.session_date}{self.session_start_time}{self.firearm_serial_number}"
            self.evidence_hash = hashlib.sha256(data.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.firearm_make} {self.firearm_model} - {self.session_date}"


class EvidenceFile(models.Model):
    """
    Individual evidence file (photo/video) with metadata.
    """
    
    FILE_TYPES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
        ('document', 'Document'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to evidence
    firearm_evidence = models.ForeignKey(FirearmEvidence, on_delete=models.PROTECT, null=True, blank=True, related_name='files')
    practical_assessment = models.ForeignKey('assessments.PracticalAssessment', on_delete=models.PROTECT, null=True, blank=True, related_name='evidence_files')
    
    # File info
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    file = models.FileField(upload_to='evidence_files/')
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    mime_type = models.CharField(max_length=100)
    
    # Metadata
    description = models.TextField(blank=True)
    captured_at = models.DateTimeField()
    
    # Geolocation (optional)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Compliance
    file_hash = models.CharField(max_length=64, unique=True)  # SHA-256
    is_original = models.BooleanField(default=True)
    
    uploaded_by = models.ForeignKey('users.User', on_delete=models.PROTECT)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'evidence_files'
        ordering = ['-captured_at']
    
    def save(self, *args, **kwargs):
        """Generate file hash before saving."""
        if not self.file_hash and self.file:
            # In production, read file content and hash it
            # For now, use metadata
            data = f"{self.file_name}{self.file_size}{self.uploaded_by_id}"
            self.file_hash = hashlib.sha256(data.encode()).hexdigest()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.file_type} - {self.file_name}"


class EvidenceReview(models.Model):
    """
    Review/approval of submitted evidence.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('requires_resubmission', 'Requires Resubmission'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    firearm_evidence = models.ForeignKey(FirearmEvidence, on_delete=models.CASCADE, related_name='reviews')
    
    reviewer = models.ForeignKey('users.User', on_delete=models.PROTECT)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending', db_index=True)
    
    # Feedback
    comments = models.TextField(blank=True)
    issues = models.JSONField(default=list)  # List of issues found
    
    # Timestamps
    reviewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'evidence_reviews'
        ordering = ['-reviewed_at']
    
    def __str__(self):
        return f"Review by {self.reviewer.get_full_name()} - {self.status}"
