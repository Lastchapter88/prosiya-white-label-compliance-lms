from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import F
from .models import Course, Enrollment, Lesson, LessonProgress, Module
from .serializers import (
    CourseSerializer, 
    CourseListSerializer,
    EnrollmentSerializer,
    LessonProgressSerializer,
    LessonSerializer,
    ModuleSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Course.objects.all()
        return Course.objects.filter(status='published')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, slug=None):
        course = self.get_object()
        student = request.user
        
        enrollment, created = Enrollment.objects.get_or_create(
            student=student,
            course=course,
            defaults={
                'status': 'active', # Auto-active for demo purposes, 
                'total_lessons': Lesson.objects.filter(module__course=course).count()
            }
        )
        
        if not created:
            return Response({"message": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAdminUser]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin sees all, Students see enrolled
        if self.request.user.is_staff:
            return Lesson.objects.all()
        return Lesson.objects.filter(module__course__enrollments__student=self.request.user).distinct()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        lesson = self.get_object()
        enrollment = Enrollment.objects.filter(
            student=request.user, 
            course=lesson.module.course
        ).first()

        if not enrollment:
            return Response({"error": "Not enrolled in this course"}, status=status.HTTP_403_FORBIDDEN)

        progress, created = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson,
            defaults={'status': 'completed', 'completed_at': timezone.now()}
        )

        if not created and progress.status != 'completed':
            progress.status = 'completed'
            progress.completed_at = timezone.now()
            progress.save()

        # Update enrollment progress
        completed_count = LessonProgress.objects.filter(enrollment=enrollment, status='completed').count()
        total_count = Lesson.objects.filter(module__course=enrollment.course).count()
        
        enrollment.completed_lessons = completed_count
        enrollment.total_lessons = total_count
        if total_count > 0:
            enrollment.progress_percentage = (completed_count / total_count) * 100
        
        if completed_count == total_count:
            enrollment.status = 'completed'
            enrollment.completed_at = timezone.now()
            
        enrollment.save()

        return Response({"status": "completed", "progress_percentage": enrollment.progress_percentage})

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.filter(student=self.request.user)

class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return LessonProgress.objects.all()
        return LessonProgress.objects.filter(enrollment__student=self.request.user)
