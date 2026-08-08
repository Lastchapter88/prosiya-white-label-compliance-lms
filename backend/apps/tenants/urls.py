from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TenantViewSet, TenantThemeViewSet, TenantSettingsViewSet

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'themes', TenantThemeViewSet)
router.register(r'settings', TenantSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
