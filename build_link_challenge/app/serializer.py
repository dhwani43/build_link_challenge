from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework import serializers

class UserListSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser', 'name', 'id']
    name = serializers.SerializerMethodField('get_name')

    def get_name(self, obj):
        return '{} {}'.format(obj.first_name, obj.last_name) 

class UserDetailSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser', 'id', 'last_login', 'email', 'date_joined']