from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentViewSet, LessonProgressViewSet, LessonViewSet, ModuleViewSet

router = DefaultRouter()
router.register(r'list', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'progress', LessonProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
