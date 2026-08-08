import os

apps = [
    'tenants', 'users', 'courses', 'assessments', 
    'evidence', 'certificates', 'assets', 'payments', 'audit'
]

base_dir = os.path.dirname(os.path.abspath(__file__))
apps_dir = os.path.join(base_dir, 'apps')

template = """from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = router.urls
"""

for app in apps:
    app_path = os.path.join(apps_dir, app)
    urls_path = os.path.join(app_path, 'urls.py')
    
    if os.path.exists(app_path) and not os.path.exists(urls_path):
        print(f"Creating urls.py for {app}...")
        with open(urls_path, 'w') as f:
            f.write(template)
    elif not os.path.exists(app_path):
        print(f"App {app} does not exist!")
    else:
        print(f"urls.py already exists for {app}")
