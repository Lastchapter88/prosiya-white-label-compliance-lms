from rest_framework import serializers
from .models import Course, Module, Lesson, Enrollment, LessonProgress

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'lesson_type', 'duration_minutes', 
            'order', 'is_mandatory', 'video_url', 'content_html'
        ]

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'order', 'lessons', 'duration_hours']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'short_description', 
            'cover_image', 'category', 'level', 'duration_hours',
            'price', 'currency', 'status', 'modules',
            'psira_code', 'qcto_code', 'sasseta_code',
            'practical_hours', 'theory_hours', 'min_age'
        ]

class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'short_description', 
            'cover_image', 'category', 'level', 'duration_hours',
            'price', 'currency'
        ]

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = '__all__'
        read_only_fields = ['id']

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseListSerializer(source='course', read_only=True)
    lesson_progress = LessonProgressSerializer(many=True, read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['id', 'enrolled_at', 'progress_percentage', 'completed_lessons', 'total_lessons']
