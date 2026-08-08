from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tenant, TenantTheme, TenantSettings
from .serializers import (
    TenantSerializer, 
    TenantCreateUpdateSerializer,
    TenantThemeSerializer, 
    TenantSettingsSerializer
)

class TenantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing tenants.
    """
    queryset = Tenant.objects.all()
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser] # Restrict to admins for now
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TenantCreateUpdateSerializer
        return TenantSerializer

class TenantThemeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenant themes.
    """
    queryset = TenantTheme.objects.all()
    serializer_class = TenantThemeSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class TenantSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tenant settings.
    """
    queryset = TenantSettings.objects.all()
    serializer_class = TenantSettingsSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
