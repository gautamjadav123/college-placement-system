from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('jobs/', JobListView.as_view()),
    path('apply/<int:job_id>/', ApplicationView.as_view()),
    path('applications/', ApplicationView.as_view()),
    path('approve/<int:job_id>/', AdminApprovalView.as_view()),
    path('notifications/', NotificationView.as_view()),
]
