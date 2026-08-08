from rest_framework import serializers
from .models import QuestionBank, Assessment, AssessmentQuestion, AssessmentAttempt, PracticalAssessment

class QuestionBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    question = QuestionBankSerializer(read_only=True)
    
    class Meta:
        model = AssessmentQuestion
        fields = ['question', 'order']

class AssessmentSerializer(serializers.ModelSerializer):
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)
    
    class Meta:
        model = Assessment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

class AssessmentAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAttempt
        fields = '__all__'
        read_only_fields = ['id', 'started_at', 'submitted_at', 'time_taken_seconds', 'score', 'percentage', 'passed', 'graded_by', 'graded_at']

class PracticalAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticalAssessment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'started_at', 'completed_at']
