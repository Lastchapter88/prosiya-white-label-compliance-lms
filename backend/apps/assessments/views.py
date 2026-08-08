from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import QuestionBank, Assessment, AssessmentAttempt, PracticalAssessment
from .serializers import (
    QuestionBankSerializer, 
    AssessmentSerializer, 
    AssessmentAttemptSerializer, 
    PracticalAssessmentSerializer
)

class QuestionBankViewSet(viewsets.ModelViewSet):
    queryset = QuestionBank.objects.all()
    serializer_class = QuestionBankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='start-attempt')
    def start_attempt(self, request, pk=None):
        assessment = self.get_object()
        # Find enrollment for this student and course
        from apps.courses.models import Enrollment
        enrollment = Enrollment.objects.filter(student=request.user, course=assessment.course).first()
        
        if not enrollment:
            return Response({"error": "No enrollment found for this course"}, status=status.HTTP_400_BAD_REQUEST)
            
        attempt_count = AssessmentAttempt.objects.filter(assessment=assessment, student=request.user).count()
        
        if attempt_count >= assessment.max_attempts:
            return Response({"error": "Maximum attempts reached"}, status=status.HTTP_400_BAD_REQUEST)
            
        attempt = AssessmentAttempt.objects.create(
            assessment=assessment,
            student=request.user,
            enrollment=enrollment,
            attempt_number=attempt_count + 1,
            status='in_progress'
        )
        
        serializer = AssessmentAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AssessmentAttemptViewSet(viewsets.ModelViewSet):
    queryset = AssessmentAttempt.objects.all()
    serializer_class = AssessmentAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='submit')
    def submit_attempt(self, request, pk=None):
        attempt = self.get_object()
        if attempt.status != 'in_progress':
            return Response({"error": "Attempt is not in progress"}, status=status.HTTP_400_BAD_REQUEST)
            
        attempt.status = 'submitted'
        attempt.submitted_at = timezone.now()
        attempt.answers = request.data.get('answers', {})
        # Simple grading logic could go here or as a background task
        attempt.save()
        
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)

class PracticalAssessmentViewSet(viewsets.ModelViewSet):
    queryset = PracticalAssessment.objects.all()
    serializer_class = PracticalAssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]
