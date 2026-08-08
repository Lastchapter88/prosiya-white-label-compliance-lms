from rest_framework import serializers
from .models import Tenant, TenantTheme, TenantSettings

class TenantThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantTheme
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class TenantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantSettings
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class TenantSerializer(serializers.ModelSerializer):
    theme = TenantThemeSerializer(read_only=True)
    settings = TenantSettingsSerializer(read_only=True)

    class Meta:
        model = Tenant
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
        
class TenantCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
