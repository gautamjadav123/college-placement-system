from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Job, Application, Interview, Notification, PlacementStat


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)

    class Meta:
        model = Profile
        fields = '__all__'
        extra_kwargs = {
            'company_website': {'required': False, 'allow_blank': True},
            'company_name': {'required': False, 'allow_blank': True},
            'company_description': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'skills': {'required': False, 'allow_blank': True},
            'branch': {'required': False, 'allow_blank': True},
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=['student', 'company'])
    first_name = serializers.CharField(required=False, default='')
    last_name = serializers.CharField(required=False, default='')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.profile.company_name', read_only=True)
    company_username = serializers.CharField(source='company.username', read_only=True)
    applicant_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['company', 'approved', 'created_at']

    def get_applicant_count(self, obj):
        return obj.applications.count()


class ApplicationSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    student_profile = serializers.SerializerMethodField()
    job = JobSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['student', 'job', 'applied_at']

    def get_student_profile(self, obj):
        return ProfileSerializer(obj.student.profile).data


class InterviewSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class PlacementStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStat
        fields = '__all__'
