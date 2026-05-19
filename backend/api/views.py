from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Count, Avg, Max, Q
from .models import Profile, Job, Application, Interview, Notification, PlacementStat
from .serializers import *
from .permissions import IsStudent, IsCompany, IsAdmin, IsCompanyOrAdmin


# ===================== AUTH =====================

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
        )
        profile = user.profile
        profile.role = data['role']
        profile.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'msg': 'Registered successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': profile.role,
            'user_id': user.id,
            'username': user.username,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.profile.role,
                'user_id': user.id,
                'username': user.username,
            })
        return Response({'error': 'Invalid credentials'}, status=400)


# ===================== PROFILE =====================

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(request.user.profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ResumeUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        profile = request.user.profile
        if 'resume' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=400)
        profile.resume = request.FILES['resume']
        profile.save()
        return Response({'msg': 'Resume uploaded', 'resume_url': profile.resume.url})


# ===================== JOBS =====================

class JobListView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Job.objects.all()

        # Students see only approved jobs
        if hasattr(user, 'profile') and user.profile.role == 'student':
            qs = qs.filter(approved=True)

            # Optional filters
            branch = self.request.query_params.get('branch')
            if branch:
                qs = qs.filter(Q(eligible_branches__icontains=branch) | Q(eligible_branches=''))

            min_cgpa = self.request.query_params.get('min_cgpa')
            if min_cgpa:
                qs = qs.filter(eligibility_cgpa__lte=float(min_cgpa))

        # Companies see their own jobs
        elif hasattr(user, 'profile') and user.profile.role == 'company':
            qs = qs.filter(company=user)

        # Admin sees all
        return qs

    def perform_create(self, serializer):
        serializer.save(company=self.request.user, approved=False)
        # Notify admin
        admins = User.objects.filter(profile__role='admin')
        for admin_user in admins:
            Notification.objects.create(
                user=admin_user,
                message=f"New job posted: {serializer.instance.title} by {self.request.user.profile.company_name}",
                notification_type='job'
            )


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]


# ===================== APPLICATIONS =====================

class ApplyView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, approved=True)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found or not approved'}, status=404)

        profile = request.user.profile

        # Eligibility check
        if profile.cgpa < job.eligibility_cgpa:
            return Response({'error': f'Minimum CGPA required: {job.eligibility_cgpa}'}, status=400)

        if job.eligible_branches:
            eligible = [b.strip() for b in job.eligible_branches.split(',')]
            if profile.branch not in eligible:
                return Response({'error': f'Your branch {profile.branch} is not eligible'}, status=400)

        # Check duplicate
        if Application.objects.filter(student=request.user, job=job).exists():
            return Response({'error': 'Already applied'}, status=400)

        app = Application.objects.create(student=request.user, job=job)

        # Notify company
        Notification.objects.create(
            user=job.company,
            message=f"{request.user.username} applied for {job.title}",
            notification_type='application'
        )

        return Response({'message': 'Applied successfully', 'application_id': app.id}, status=201)


class StudentApplicationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        apps = Application.objects.filter(student=request.user)
        return Response(ApplicationSerializer(apps, many=True).data)


class CompanyApplicantsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompany]

    def get(self, request, job_id=None):
        if job_id:
            apps = Application.objects.filter(job__id=job_id, job__company=request.user)
        else:
            apps = Application.objects.filter(job__company=request.user)
        return Response(ApplicationSerializer(apps, many=True).data)


class ShortlistView(APIView):
    """Company shortlists/rejects candidates"""
    permission_classes = [permissions.IsAuthenticated, IsCompanyOrAdmin]

    def post(self, request, application_id):
        try:
            app = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=404)

        new_status = request.data.get('status')
        if new_status not in ['Shortlisted', 'Rejected', 'Selected']:
            return Response({'error': 'Invalid status'}, status=400)

        app.status = new_status
        app.save()

        # Notify student
        Notification.objects.create(
            user=app.student,
            message=f"Your application for {app.job.title} has been {new_status}",
            notification_type='application'
        )

        return Response({'msg': f'Application {new_status}'})


# ===================== ADMIN =====================

class AdminApproveJobView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        job.approved = True
        job.save()

        # Notify company
        Notification.objects.create(
            user=job.company,
            message=f"Your job '{job.title}' has been approved!",
            notification_type='job'
        )

        # Notify eligible students
        students = User.objects.filter(profile__role='student', profile__cgpa__gte=job.eligibility_cgpa)
        for student in students:
            Notification.objects.create(
                user=student,
                message=f"New job available: {job.title} (CTC: {job.ctc} LPA)",
                notification_type='job'
            )

        return Response({'msg': 'Job approved'})


class AdminRejectJobView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        job.delete()

        Notification.objects.create(
            user=job.company,
            message=f"Your job '{job.title}' was rejected by admin.",
            notification_type='job'
        )

        return Response({'msg': 'Job rejected and deleted'})


class AdminStudentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        profiles = Profile.objects.filter(role='student').select_related('user')
        return Response(ProfileSerializer(profiles, many=True).data)


class AdminCompaniesView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        profiles = Profile.objects.filter(role='company').select_related('user')
        return Response(ProfileSerializer(profiles, many=True).data)


class AdminAllJobsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        jobs = Job.objects.all()
        return Response(JobSerializer(jobs, many=True).data)


class AdminAllApplicationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        apps = Application.objects.all()
        return Response(ApplicationSerializer(apps, many=True).data)


# ===================== INTERVIEWS =====================

class ScheduleInterviewView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsCompanyOrAdmin]

    def post(self, request, application_id):
        try:
            app = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=404)

        app.status = 'Interview'
        app.save()

        interview, created = Interview.objects.update_or_create(
            application=app,
            defaults={
                'date': request.data.get('date'),
                'venue': request.data.get('venue', ''),
                'notes': request.data.get('notes', ''),
            }
        )

        # Notify student
        Notification.objects.create(
            user=app.student,
            message=f"Interview scheduled for {app.job.title} on {request.data.get('date')} at {request.data.get('venue', 'TBD')}",
            notification_type='interview'
        )

        return Response(InterviewSerializer(interview).data, status=201)


class InterviewListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.profile.role == 'student':
            interviews = Interview.objects.filter(application__student=user)
        elif user.profile.role == 'company':
            interviews = Interview.objects.filter(application__job__company=user)
        else:
            interviews = Interview.objects.all()
        return Response(InterviewSerializer(interviews, many=True).data)


class UpdateResultView(APIView):
    """Admin/Company updates final result for application"""
    permission_classes = [permissions.IsAuthenticated, IsCompanyOrAdmin]

    def post(self, request, application_id):
        try:
            app = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=404)

        result = request.data.get('result')
        if result not in ['Selected', 'Rejected']:
            return Response({'error': 'Result must be Selected or Rejected'}, status=400)

        app.status = result
        app.save()

        Notification.objects.create(
            user=app.student,
            message=f"Result for {app.job.title}: You have been {result}!",
            notification_type='application'
        )

        return Response({'msg': f'Result updated: {result}'})


# ===================== NOTIFICATIONS =====================

class NotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        unread = request.query_params.get('unread')
        if unread == 'true':
            notifications = notifications.filter(is_read=False)
        return Response(NotificationSerializer(notifications, many=True).data)


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notification_id=None):
        if notification_id:
            Notification.objects.filter(id=notification_id, user=request.user).update(is_read=True)
        else:
            Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({'msg': 'Marked as read'})


# ===================== DASHBOARD / STATS =====================

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = user.profile.role

        if role == 'student':
            return Response({
                'total_jobs': Job.objects.filter(approved=True).count(),
                'my_applications': Application.objects.filter(student=user).count(),
                'shortlisted': Application.objects.filter(student=user, status='Shortlisted').count(),
                'selected': Application.objects.filter(student=user, status='Selected').count(),
                'interviews': Interview.objects.filter(application__student=user).count(),
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
            })

        elif role == 'company':
            my_jobs = Job.objects.filter(company=user)
            return Response({
                'total_jobs_posted': my_jobs.count(),
                'approved_jobs': my_jobs.filter(approved=True).count(),
                'pending_jobs': my_jobs.filter(approved=False).count(),
                'total_applicants': Application.objects.filter(job__company=user).count(),
                'shortlisted': Application.objects.filter(job__company=user, status='Shortlisted').count(),
                'selected': Application.objects.filter(job__company=user, status='Selected').count(),
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
            })

        elif role == 'admin':
            return Response({
                'total_students': Profile.objects.filter(role='student').count(),
                'total_companies': Profile.objects.filter(role='company').count(),
                'total_jobs': Job.objects.count(),
                'pending_jobs': Job.objects.filter(approved=False).count(),
                'approved_jobs': Job.objects.filter(approved=True).count(),
                'total_applications': Application.objects.count(),
                'total_selected': Application.objects.filter(status='Selected').count(),
                'total_interviews': Interview.objects.count(),
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
                'company_wise_hiring': list(
                    Application.objects.filter(status='Selected')
                    .values('job__company__profile__company_name')
                    .annotate(count=Count('id'))
                    .order_by('-count')[:10]
                ),
            })

        return Response({'error': 'Unknown role'}, status=400)


class PlacementStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        stats = PlacementStat.objects.all()
        return Response(PlacementStatSerializer(stats, many=True).data)


# ===================== ADMIN REGISTRATION =====================

class AdminRegisterView(APIView):
    """Only existing admins can register new admins"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'username, email, and password are required'}, status=400)

        if len(password) < 6:
            return Response({'error': 'Password must be at least 6 characters'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        profile = user.profile
        profile.role = 'admin'
        profile.save()

        return Response({
            'msg': 'Admin account created successfully',
            'user_id': user.id,
            'username': user.username,
            'role': 'admin',
        }, status=status.HTTP_201_CREATED)
