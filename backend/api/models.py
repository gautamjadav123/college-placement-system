from django.db import models
from django.contrib.auth.models import User

ROLE_CHOICES = (
    ('student', 'Student'),
    ('company', 'Company'),
    ('admin', 'Admin'),
)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    branch = models.CharField(max_length=50, blank=True)
    cgpa = models.FloatField(default=0)
    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

class Job(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    ctc = models.DecimalField(max_digits=10, decimal_places=2)
    eligibility_cgpa = models.FloatField(default=0)
    skills_required = models.TextField(blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('Applied', 'Applied'), ('Shortlisted', 'Shortlisted'), ('Rejected', 'Rejected')],
        default='Applied'
    )
    applied_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
