from django.urls import path
from .views import *

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),

    # Profile
    path('profile/', ProfileView.as_view()),
    path('profile/resume/', ResumeUploadView.as_view()),

    # Jobs
    path('jobs/', JobListView.as_view()),
    path('jobs/<int:pk>/', JobDetailView.as_view()),

    # Applications
    path('apply/<int:job_id>/', ApplyView.as_view()),
    path('my-applications/', StudentApplicationsView.as_view()),
    path('applicants/', CompanyApplicantsView.as_view()),
    path('applicants/<int:job_id>/', CompanyApplicantsView.as_view()),
    path('shortlist/<int:application_id>/', ShortlistView.as_view()),

    # Admin
    path('admin/approve/<int:job_id>/', AdminApproveJobView.as_view()),
    path('admin/reject/<int:job_id>/', AdminRejectJobView.as_view()),
    path('admin/students/', AdminStudentsView.as_view()),
    path('admin/companies/', AdminCompaniesView.as_view()),
    path('admin/jobs/', AdminAllJobsView.as_view()),
    path('admin/applications/', AdminAllApplicationsView.as_view()),

    # Admin Registration
    path('admin/register/', AdminRegisterView.as_view()),

    # Interviews
    path('interview/schedule/<int:application_id>/', ScheduleInterviewView.as_view()),
    path('interviews/', InterviewListView.as_view()),
    path('result/<int:application_id>/', UpdateResultView.as_view()),

    # Notifications
    path('notifications/', NotificationView.as_view()),
    path('notifications/read/', MarkNotificationReadView.as_view()),
    path('notifications/read/<int:notification_id>/', MarkNotificationReadView.as_view()),

    # Dashboard
    path('dashboard/', DashboardStatsView.as_view()),
    path('placement-stats/', PlacementStatsView.as_view()),
]
