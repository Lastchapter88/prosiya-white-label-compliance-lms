"""
Course models for training content delivery.
Courses → Modules → Lessons hierarchy.
"""
from django.db import models
import uuid


class Course(models.Model):
    """
    Main course entity (e.g., "Grade E Security Officer Training").
    """
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='courses')
    
    # Basic info
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, db_index=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500, blank=True)
    
    # Media
    cover_image = models.ImageField(upload_to='course_covers/', null=True, blank=True)
    intro_video = models.FileField(upload_to='course_videos/', null=True, blank=True)
    
    # Classification
    category = models.CharField(max_length=100, db_index=True)
    level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ])
    
    # Compliance
    psira_code = models.CharField(max_length=50, blank=True)
    qcto_code = models.CharField(max_length=50, blank=True)
    sasseta_code = models.CharField(max_length=50, blank=True)
    
    # Duration
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2)
    practical_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    theory_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Requirements
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='unlocks')
    min_age = models.IntegerField(default=18)
    requires_id_verification = models.BooleanField(default=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='ZAR')
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', db_index=True)
    is_featured = models.BooleanField(default=False)
    
    # Stats
    enrollment_count = models.IntegerField(default=0)
    completion_count = models.IntegerField(default=0)
    
    # Audit
    created_by = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='created_courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']
        unique_together = [['tenant', 'slug']]
        indexes = [
            models.Index(fields=['tenant', 'status']),
            models.Index(fields=['category', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.tenant.name})"


class Module(models.Model):
    """
    Course module/section (e.g., "Legal Framework").
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    is_published = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'course_modules'
        ordering = ['course', 'order']
        unique_together = [['course', 'order']]
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    """
    Individual lesson within a module.
    """
    
    LESSON_TYPES = [
        ('video', 'Video'),
        ('document', 'Document'),
        ('quiz', 'Quiz'),
        ('live', 'Live Session'),
        ('practical', 'Practical'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPES)
    order = models.IntegerField(default=0)
    
    # Content
    video_url = models.URLField(blank=True)
    video_file = models.FileField(upload_to='lesson_videos/', null=True, blank=True)
    document_file = models.FileField(upload_to='lesson_documents/', null=True, blank=True)
    content_html = models.TextField(blank=True)
    
    # Duration
    duration_minutes = models.IntegerField(default=0)
    
    # Settings
    is_mandatory = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    requires_completion = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lessons'
        ordering = ['module', 'order']
        unique_together = [['module', 'order']]
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"


class Enrollment(models.Model):
    """
    Student enrollment in a course.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    student = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    
    # Progress
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    completed_lessons = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    
    # Dates
    enrolled_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Payment
    payment_status = models.CharField(max_length=20, default='pending')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'enrollments'
        ordering = ['-enrolled_at']
        unique_together = [['student', 'course']]
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['course', 'status']),
        ]
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.course.title}"


class LessonProgress(models.Model):
    """
    Track student progress through individual lessons.
    """
    
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Tracking
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.IntegerField(default=0)
    
    # Video progress
    video_progress_seconds = models.IntegerField(default=0)
    video_completed = models.BooleanField(default=False)
    
    # Attempts
    attempt_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'lesson_progress'
        unique_together = [['enrollment', 'lesson']]
        indexes = [
            models.Index(fields=['enrollment', 'status']),
        ]
    
    def __str__(self):
        return f"{self.enrollment.student.get_full_name()} - {self.lesson.title}"
