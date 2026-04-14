from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .models import Profile, Job, Application, Notification
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

# Register user
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
        Profile.objects.create(user=user, role=data['role'])
        return Response({'msg': 'Registered successfully'})

# Login
class LoginView(APIView):
    def post(self, request):
        from django.contrib.auth import authenticate
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'role': user.profile.role})
        return Response({'error': 'Invalid credentials'}, status=400)

# CRUD
class JobListView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(approved=True)
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(company=self.request.user, approved=False)

class ApplicationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, job_id):
        job = Job.objects.get(id=job_id)
        if request.user.profile.cgpa >= job.eligibility_cgpa:
            Application.objects.create(student=request.user, job=job)
            Notification.objects.create(user=job.company, message=f"{request.user.username} applied for {job.title}")
            return Response({'message': 'Applied successfully'})
        return Response({'message': 'Not eligible'}, status=400)

    def get(self, request):
        apps = Application.objects.filter(student=request.user)
        return Response(ApplicationSerializer(apps, many=True).data)

class AdminApprovalView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def post(self, request, job_id):
        job = Job.objects.get(id=job_id)
        job.approved = True
        job.save()
        Notification.objects.create(user=job.company, message=f"Your job '{job.title}' was approved.")
        return Response({'msg': 'Approved'})

class NotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        notes = Notification.objects.filter(user=request.user).order_by('-created_at')
        return Response(NotificationSerializer(notes, many=True).data)
