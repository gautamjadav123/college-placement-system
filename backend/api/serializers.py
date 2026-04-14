from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Job, Application, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    company = UserSerializer(read_only=True)
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
