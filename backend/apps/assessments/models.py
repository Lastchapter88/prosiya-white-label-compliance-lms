"""
Assessment models for online and practical evaluations.
"""
from django.db import models
import uuid


class QuestionBank(models.Model):
    """
    Repository of questions for assessments.
    """
    
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('essay', 'Essay'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='questions')
    
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    
    # Options (for multiple choice)
    options = models.JSONField(default=list)  # [{"id": "a", "text": "Option A"}, ...]
    correct_answer = models.JSONField(default=dict)  # {"answer": "a"} or {"answer": "text"}
    
    # Metadata
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ])
    points = models.IntegerField(default=1)
    category = models.CharField(max_length=100, blank=True)
    
    # Media
    image = models.ImageField(upload_to='question_images/', null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey('users.User', on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'question_bank'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.question_text[:50]}..."


class Assessment(models.Model):
    """
    Assessment/exam configuration.
    """
    
    ASSESSMENT_TYPES = [
        ('online', 'Online Exam'),
        ('practical', 'Practical Assessment'),
        ('mixed', 'Mixed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='assessments')
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPES)
    
    # Configuration
    total_questions = models.IntegerField(default=20)
    randomize_questions = models.BooleanField(default=True)
    randomize_options = models.BooleanField(default=True)
    
    # Timing
    duration_minutes = models.IntegerField(default=60)
    
    # Scoring
    passing_score = models.IntegerField(default=70)  # Percentage
    total_points = models.IntegerField(default=100)
    
    # Attempts
    max_attempts = models.IntegerField(default=3)
    allow_review = models.BooleanField(default=True)
    show_correct_answers = models.BooleanField(default=False)
    
    # Proctoring
    requires_invigilator = models.BooleanField(default=False)
    requires_webcam = models.BooleanField(default=False)
    
    # Questions
    questions = models.ManyToManyField(QuestionBank, through='AssessmentQuestion')
    
    is_published = models.BooleanField(default=False)
    
    created_by = models.ForeignKey('users.User', on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assessments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"


class AssessmentQuestion(models.Model):
    """
    Through model for Assessment-Question relationship.
    """
    
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    question = models.ForeignKey(QuestionBank, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'assessment_questions'
        ordering = ['assessment', 'order']
        unique_together = [['assessment', 'question']]


class AssessmentAttempt(models.Model):
    """
    Student's attempt at an assessment.
    """
    
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('passed', 'Passed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='assessment_attempts')
    enrollment = models.ForeignKey('courses.Enrollment', on_delete=models.CASCADE, related_name='assessment_attempts')
    
    attempt_number = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress', db_index=True)
    
    # Timing
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_taken_seconds = models.IntegerField(default=0)
    
    # Scoring
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    passed = models.BooleanField(default=False)
    
    # Answers
    answers = models.JSONField(default=dict)  # {question_id: answer}
    
    # Proctoring
    invigilator = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='invigilated_assessments')
    invigilator_notes = models.TextField(blank=True)
    
    # Audit
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    graded_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_assessments')
    graded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'assessment_attempts'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['assessment', 'status']),
        ]
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.assessment.title} (Attempt {self.attempt_number})"


class PracticalAssessment(models.Model):
    """
    Practical/hands-on assessment (e.g., firearm handling).
    """
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('passed', 'Passed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)
    student = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='practical_assessments')
    assessor = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='assessed_practicals')
    
    # Details
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # Scheduling
    scheduled_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled', db_index=True)
    
    # Results
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    passed = models.BooleanField(default=False)
    
    # Assessor feedback
    assessor_notes = models.TextField(blank=True)
    competencies = models.JSONField(default=list)  # [{name, achieved: bool}, ...]
    
    # Signatures
    student_signature = models.TextField(blank=True)
    assessor_signature = models.TextField(blank=True)
    
    # Timestamps
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'practical_assessments'
        ordering = ['-scheduled_date']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['assessor', 'scheduled_date']),
        ]
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.title}"
