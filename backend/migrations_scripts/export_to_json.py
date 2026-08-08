import os
import sys
import django
import json
from django.core.serializers.json import DjangoJSONEncoder
from pathlib import Path

# Add backend to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR / 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.models import User, UserProfile
from apps.tenants.models import Tenant
from apps.courses.models import Course, Module, Lesson, Enrollment

def export_data():
    data = {
        "tenants": [],
        "users": [],
        "courses": [],
        "enrollments": []
    }

    # 1. Tenants
    print("Exporting Tenants...")
    for tenant in Tenant.objects.all():
        data["tenants"].append({
            "id": str(tenant.id),
            "name": tenant.name,
            "slug": tenant.slug,
            "email": tenant.email,
            "theme": {
                "primary_color": tenant.theme.primary_color if hasattr(tenant, 'theme') else "#000000"
            }
        })

    # 2. Users (and Profiles)
    print("Exporting Users...")
    for user in User.objects.all():
        profile = getattr(user, 'profile', None)
        user_doc = {
            "uid": str(user.id),  # We will use this as Firestore ID
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "role": user.role,
            "tenantId": str(user.tenant.id) if user.tenant else None,
            "isActive": user.is_active,
            "dateJoined": user.date_joined,
            "profile": {
                "bio": profile.bio if profile else "",
                "phone": user.phone_number
            }
        }
        data["users"].append(user_doc)

    # 3. Courses (Structured with Modules -> Lessons)
    print("Exporting Courses...")
    for course in Course.objects.all():
        course_doc = {
            "id": str(course.id),
            "title": course.title,
            "description": course.description,
            "tenantId": str(course.tenant.id),
            "status": course.status,
            "price": float(course.price),
            "modules": []
        }

        # Embed Modules
        for module in course.modules.all():
            module_doc = {
                "id": str(module.id),
                "title": module.title,
                "order": module.order,
                "lessons": []
            }
            
            # Embed Lessons
            for lesson in module.lessons.all():
                lesson_doc = {
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "type": lesson.lesson_type,
                    "order": lesson.order,
                    "content": lesson.content_html,
                    "videoUrl": lesson.video_url
                }
                module_doc["lessons"].append(lesson_doc)
            
            course_doc["modules"].append(module_doc)
        
        data["courses"].append(course_doc)

    # 4. Enrollments
    print("Exporting Enrollments...")
    for enrollment in Enrollment.objects.all():
        data["enrollments"].append({
            "id": str(enrollment.id),
            "userId": str(enrollment.student.id),
            "courseId": str(enrollment.course.id),
            "status": enrollment.status,
            "progress": float(enrollment.progress_percentage),
            "enrolledAt": enrollment.enrolled_at
        })

    # Write to file
    output_file = BASE_DIR / 'backend/migrations_scripts/firebase_export.json'
    with open(output_file, 'w') as f:
        json.dump(data, f, cls=DjangoJSONEncoder, indent=2)
    
    print(f"Export complete! Data saved to {output_file}")

if __name__ == '__main__':
    export_data()
