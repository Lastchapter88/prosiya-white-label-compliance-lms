from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuestionBankViewSet, 
    AssessmentViewSet, 
    AssessmentAttemptViewSet, 
    PracticalAssessmentViewSet
)

router = DefaultRouter()
router.register(r'questions', QuestionBankViewSet)
router.register(r'assessments', AssessmentViewSet)
router.register(r'attempts', AssessmentAttemptViewSet)
router.register(r'practicals', PracticalAssessmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
