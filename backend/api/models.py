from django.db import models
from django.contrib.auth.models import User

ROLE_CHOICES = (
    ('student', 'Student'),
    ('company', 'Company'),
    ('admin', 'Admin'),
)

BRANCH_CHOICES = (
    ('CS', 'Computer Science'),
    ('IT', 'Information Technology'),
    ('EC', 'Electronics & Communication'),
    ('EE', 'Electrical Engineering'),
    ('ME', 'Mechanical Engineering'),
    ('CE', 'Civil Engineering'),
)

APPLICATION_STATUS = (
    ('Applied', 'Applied'),
    ('Shortlisted', 'Shortlisted'),
    ('Interview', 'Interview Scheduled'),
    ('Selected', 'Selected'),
    ('Rejected', 'Rejected'),
)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    # Student fields
    branch = models.CharField(max_length=50, choices=BRANCH_CHOICES, blank=True)
    cgpa = models.FloatField(default=0)
    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True)
    # Company fields
    company_name = models.CharField(max_length=200, blank=True)
    company_website = models.URLField(blank=True)
    company_description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Job(models.Model):
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    title = models.CharField(max_length=200)
    description = models.TextField()
    ctc = models.DecimalField(max_digits=10, decimal_places=2)
    eligibility_cgpa = models.FloatField(default=0)
    eligible_branches = models.CharField(max_length=200, blank=True, help_text="Comma-separated branch codes: CS,IT,EC")
    skills_required = models.TextField(blank=True)
    max_positions = models.IntegerField(default=1)
    last_date = models.DateField(null=True, blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.company.profile.company_name}"


class Application(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=APPLICATION_STATUS, default='Applied')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'job')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.student.username} -> {self.job.title}"


class Interview(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='interview')
    date = models.DateTimeField()
    venue = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Interview: {self.application.student.username} for {self.application.job.title}"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    notification_type = models.CharField(max_length=30, default='info',
        choices=[('info', 'Info'), ('job', 'Job Alert'), ('application', 'Application Update'), ('interview', 'Interview')])
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.message[:50]}"


class PlacementStat(models.Model):
    """Stores yearly placement statistics"""
    year = models.IntegerField()
    total_students = models.IntegerField(default=0)
    placed_students = models.IntegerField(default=0)
    highest_ctc = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_ctc = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_companies = models.IntegerField(default=0)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"Placement Stats {self.year}"
