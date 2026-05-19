from django.contrib import admin
from .models import Profile, Job, Application, Interview, Notification, PlacementStat

# Admin panel customization
admin.site.site_header = "S. R. Government Polytechnic College, Sagar"
admin.site.site_title = "SRGP Admin Portal"
admin.site.index_title = "Welcome to Placement Management System"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'branch', 'cgpa']
    list_filter = ['role', 'branch']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'ctc', 'approved', 'created_at']
    list_filter = ['approved']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'job', 'status', 'applied_at']
    list_filter = ['status']


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['application', 'date', 'venue']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'is_read', 'created_at']


@admin.register(PlacementStat)
class PlacementStatAdmin(admin.ModelAdmin):
    list_display = ['year', 'total_students', 'placed_students', 'highest_ctc', 'average_ctc']
