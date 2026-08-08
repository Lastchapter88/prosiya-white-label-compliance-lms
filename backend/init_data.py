import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.tenants.models import Tenant
from apps.users.models import User
from django.contrib.auth import get_user_model

COURSE_CATALOGUE = [
    {
        "title": "Combined Grade E, D & C",
        "slug": "combined-grade-e-d-c",
        "description": (
            "Combined security officer training covering Grades E, D and C. "
            "Ideal for new entrants who need the full entry-to-intermediate pathway."
        ),
        "short_description": "Grades E, D & C combined package.",
        "category": "Security",
        "level": "beginner",
        "duration_hours": 120,
        "price": 1950.00,
        "psira_code": "XO-EDC",
        "module_title": "Module 1: Grades E, D & C Foundations",
        "lesson_title": "Introduction to Security Grades E–C",
    },
    {
        "title": "Grade C Security Officer",
        "slug": "grade-c-security",
        "description": "Individual Grade C security officer training for PSIRA-aligned competency.",
        "short_description": "Individual Grade C security training.",
        "category": "Security",
        "level": "intermediate",
        "duration_hours": 40,
        "price": 1050.00,
        "psira_code": "XO-C",
        "module_title": "Module 1: Grade C Competencies",
        "lesson_title": "Grade C Legal and Operational Requirements",
    },
    {
        "title": "Grade B Security Officer",
        "slug": "grade-b-security",
        "description": "Grade B supervisory-level security officer training.",
        "short_description": "Individual Grade B security training.",
        "category": "Security",
        "level": "intermediate",
        "duration_hours": 40,
        "price": 1500.00,
        "psira_code": "XO-B",
        "module_title": "Module 1: Grade B Supervision",
        "lesson_title": "Grade B Roles and Responsibilities",
    },
    {
        "title": "Grade A Security Officer",
        "slug": "grade-a-security",
        "description": "Grade A advanced security officer training.",
        "short_description": "Individual Grade A security training.",
        "category": "Security",
        "level": "advanced",
        "duration_hours": 40,
        "price": 1500.00,
        "psira_code": "XO-A",
        "module_title": "Module 1: Grade A Advanced Practice",
        "lesson_title": "Grade A Operational Leadership",
    },
    {
        "title": "Armed Response",
        "slug": "armed-response",
        "description": "Armed response officer training for the private security industry.",
        "short_description": "Armed response officer training.",
        "category": "Security",
        "level": "advanced",
        "duration_hours": 40,
        "price": 1600.00,
        "psira_code": "XO-AR",
        "module_title": "Module 1: Armed Response Fundamentals",
        "lesson_title": "Armed Response Procedures and Safety",
    },
    {
        "title": "CIT",
        "slug": "cit",
        "description": (
            "Cash-in-transit (CIT) training covering procedures, risk awareness, "
            "and operational requirements for the security industry."
        ),
        "short_description": "Cash-in-transit (CIT) training.",
        "category": "Security",
        "level": "advanced",
        "duration_hours": 40,
        "price": 1600.00,
        "psira_code": "XO-CIT",
        "module_title": "Module 1: CIT Fundamentals",
        "lesson_title": "Cash-in-Transit Procedures and Safety",
    },
    {
        "title": "CPO",
        "slug": "cpo",
        "description": (
            "Close Protection Officer (CPO) training for advanced personal protection "
            "and high-risk security environments."
        ),
        "short_description": "Close Protection Officer (CPO) training.",
        "category": "Security",
        "level": "advanced",
        "duration_hours": 80,
        "price": 16750.00,
        "psira_code": "XO-CPO",
        "module_title": "Module 1: Close Protection Fundamentals",
        "lesson_title": "CPO Roles, Risk and Operational Practice",
    },
    {
        "title": "Handgun Business Purpose",
        "slug": "handgun-business-purpose",
        "description": (
            "Firearm competency training for handgun use for business purposes, "
            "covering legal requirements, safe handling, and practical competency."
        ),
        "short_description": "Handgun competency for business purposes.",
        "category": "Firearm",
        "level": "intermediate",
        "duration_hours": 40,
        "price": 2650.00,
        "psira_code": "FA-HG",
        "module_title": "Module 1: Handgun Competency",
        "lesson_title": "Handgun Legal Framework and Safe Handling",
    },
    {
        "title": "Rifle SLR or Carbine",
        "slug": "rifle-slr-carbine",
        "description": (
            "Firearm competency training for rifle SLR or carbine, "
            "covering legal requirements, safe handling, and practical competency."
        ),
        "short_description": "Rifle SLR or carbine competency training.",
        "category": "Firearm",
        "level": "intermediate",
        "duration_hours": 40,
        "price": 2850.00,
        "psira_code": "FA-RF",
        "module_title": "Module 1: Rifle / Carbine Competency",
        "lesson_title": "Rifle and Carbine Safe Handling",
    },
    {
        "title": "Shotgun for Business Purpose",
        "slug": "shotgun-business-purpose",
        "description": (
            "Firearm competency training for shotgun use for business purposes, "
            "covering legal requirements, safe handling, and practical competency."
        ),
        "short_description": "Shotgun competency for business purposes.",
        "category": "Firearm",
        "level": "intermediate",
        "duration_hours": 40,
        "price": 2700.00,
        "psira_code": "FA-SG",
        "module_title": "Module 1: Shotgun Competency",
        "lesson_title": "Shotgun Legal Framework and Safe Handling",
    },
]


def ensure_course(tenant, admin_user, Course, Module, Lesson, spec):
    course, created = Course.objects.update_or_create(
        slug=spec["slug"],
        defaults={
            "tenant": tenant,
            "title": spec["title"],
            "description": spec["description"],
            "short_description": spec["short_description"],
            "category": spec["category"],
            "level": spec["level"],
            "duration_hours": spec["duration_hours"],
            "price": spec["price"],
            "currency": "ZAR",
            "status": "published",
            "created_by": admin_user,
            "psira_code": spec["psira_code"],
            "is_featured": True,
        },
    )

    if created or not course.modules.exists():
        module = Module.objects.create(
            course=course,
            title=spec["module_title"],
            order=1,
            is_published=True,
        )
        Lesson.objects.create(
            module=module,
            title=spec["lesson_title"],
            lesson_type="video",
            order=1,
            is_published=True,
            duration_minutes=20,
        )

    action = "Created" if created else "Updated"
    print(f"{action} course: {course.title} (R{spec['price']:.0f})")
    return course


def init_data():
    print("Initializing data...")

    # 1. Create Default Tenant
    tenant_name = "ProSiya Academy"
    if not Tenant.objects.filter(name=tenant_name).exists():
        print(f"Creating tenant: {tenant_name}")
        tenant = Tenant.objects.create(
            name=tenant_name,
            slug="prosiya",
            email="info@prosiya.co.za",
            phone="+27785236606",
            street_address="Durban",
            city="Durban",
            province="KwaZulu-Natal",
            postal_code="4000",
            country="South Africa",
            registration_number="REG123456",
            status="active",
        )
    else:
        tenant = Tenant.objects.get(name=tenant_name)
        tenant.phone = "+27785236606"
        tenant.email = tenant.email or "info@prosiya.co.za"
        if hasattr(tenant, "city"):
            tenant.city = "Durban"
        if hasattr(tenant, "province"):
            tenant.province = "KwaZulu-Natal"
        tenant.save()
        print(f"Tenant '{tenant_name}' already exists.")

    # 2. Create Superuser
    User = get_user_model()
    admin_email = "admin@prosiya.com"
    if not User.objects.filter(email=admin_email).exists():
        print(f"Creating superuser: {admin_email}")
        User.objects.create_superuser(
            email=admin_email,
            password="adminpassword123",  # Change in production!
            first_name="Admin",
            last_name="User",
            tenant=tenant,
        )
        print("Superuser created successfully.")
    else:
        print(f"Superuser '{admin_email}' already exists.")

    # 3. Create / update course catalogue
    from apps.courses.models import Course, Module, Lesson

    admin_user = User.objects.get(email=admin_email)

    for spec in COURSE_CATALOGUE:
        ensure_course(tenant, admin_user, Course, Module, Lesson, spec)

    # Archive old sample Grade E if it still exists as a standalone offering
    legacy = Course.objects.filter(slug="grade-e-security").first()
    if legacy:
        legacy.status = "archived"
        legacy.save(update_fields=["status"])
        print("Archived legacy course: Grade E Security Officer Training")

    print("Course catalogue ready.")


if __name__ == "__main__":
    init_data()
