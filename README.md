# 🎓 College Placement System

### SR Government Polytechnic College

Full-stack placement management system with Django REST Framework backend and React.js frontend.

---

## 📁 Updated Folder Structure

```
college-placement-system/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── media/resumes/          # Uploaded resumes
│   ├── placement/              # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py         # ✅ Updated: CORS, JWT, Media
│   │   ├── urls.py             # ✅ Updated: Media URLs
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/                    # Main app
│       ├── __init__.py
│       ├── apps.py             # ✅ Updated: signals import
│       ├── models.py           # ✅ Updated: Interview, PlacementStat, more fields
│       ├── serializers.py      # ✅ Updated: All serializers
│       ├── views.py            # ✅ Updated: 20+ API views
│       ├── urls.py             # ✅ Updated: 20+ endpoints
│       ├── permissions.py      # ✅ Updated: Role-based permissions
│       ├── signals.py          # ✅ NEW: Auto-create profile
│       ├── admin.py            # ✅ Updated: Admin panel
│       └── migrations/
│           └── __init__.py
│
└── frontend/
    ├── package.json            # ✅ Updated: new dependencies
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js              # ✅ Updated: All routes + AuthProvider
        ├── api.js              # ✅ Updated: JWT interceptors
        ├── context/
        │   └── AuthContext.js  # ✅ NEW: Auth state management
        ├── components/
        │   ├── Navbar.js       # ✅ Updated: Role-based navigation
        │   └── ProtectedRoute.js # ✅ NEW: Route guards
        └── pages/
            ├── Login.js        # ✅ Updated: JWT + toast
            ├── Register.js     # ✅ Updated: Auto-login after register
            ├── Dashboard.js    # ✅ NEW: Role-based dashboard + charts
            ├── JobList.js      # ✅ Updated: Full job cards
            ├── PostJob.js      # ✅ NEW: Company posts jobs
            ├── MyApplications.js # ✅ NEW: Student tracks apps
            ├── CompanyApplicants.js # ✅ NEW: Shortlist/interview
            ├── ProfilePage.js  # ✅ NEW: Edit profile + resume upload
            ├── Notifications.js # ✅ Updated: Mark as read
            ├── AdminStudents.js # ✅ NEW: Manage students
            ├── AdminCompanies.js # ✅ NEW: Manage companies
            ├── AdminJobs.js    # ✅ NEW: Approve/reject jobs
            └── Interviews.js   # ✅ NEW: View interviews
```

---

## 🔌 API Endpoints

| Method   | Endpoint                            | Description               | Auth          |
| -------- | ----------------------------------- | ------------------------- | ------------- |
| POST     | `/api/register/`                    | Register student/company  | No            |
| POST     | `/api/login/`                       | Login, get JWT tokens     | No            |
| GET/PUT  | `/api/profile/`                     | View/update profile       | Yes           |
| POST     | `/api/profile/resume/`              | Upload resume             | Student       |
| GET/POST | `/api/jobs/`                        | List/create jobs          | Yes           |
| GET      | `/api/jobs/<id>/`                   | Job detail                | Yes           |
| POST     | `/api/apply/<job_id>/`              | Apply for job             | Student       |
| GET      | `/api/my-applications/`             | Student's applications    | Student       |
| GET      | `/api/applicants/`                  | Company's applicants      | Company       |
| POST     | `/api/shortlist/<app_id>/`          | Update application status | Company       |
| POST     | `/api/admin/approve/<job_id>/`      | Approve job               | Admin         |
| POST     | `/api/admin/reject/<job_id>/`       | Reject job                | Admin         |
| GET      | `/api/admin/students/`              | List all students         | Admin         |
| GET      | `/api/admin/companies/`             | List all companies        | Admin         |
| GET      | `/api/admin/jobs/`                  | List all jobs             | Admin         |
| POST     | `/api/interview/schedule/<app_id>/` | Schedule interview        | Company/Admin |
| GET      | `/api/interviews/`                  | List interviews           | Yes           |
| POST     | `/api/result/<app_id>/`             | Update result             | Company/Admin |
| GET      | `/api/notifications/`               | Get notifications         | Yes           |
| POST     | `/api/notifications/read/`          | Mark all read             | Yes           |
| GET      | `/api/dashboard/`                   | Dashboard stats           | Yes           |
| GET      | `/api/placement-stats/`             | Placement statistics      | Public        |

---

## 🚀 How to Run

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Then go to Django admin and set the profile role to 'admin'

# Start server
python manage.py runserver
```

**Create Admin User (via Django shell):**

```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from api.models import Profile

user = User.objects.create_superuser('admin', 'admin@college.edu', 'admin123')
profile = user.profile
profile.role = 'admin'
profile.save()
exit()
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at: `http://localhost:3000`
Backend runs at: `http://localhost:8000`
Django Admin: `http://localhost:8000/admin/`

---

## ✅ Features Implemented

### 👨‍🎓 Student Module

- ✅ Registration & Login (JWT)
- ✅ Profile (name, skills, CGPA, branch, phone)
- ✅ Resume upload
- ✅ View approved jobs with eligibility filtering
- ✅ Apply for jobs (with CGPA + branch validation)
- ✅ Track application status

### 🏢 Recruiter/Company Module

- ✅ Company registration & login
- ✅ Post jobs (CTC, eligibility, branches, skills)
- ✅ View all applicants
- ✅ Shortlist/Reject/Select candidates
- ✅ Schedule interviews

### 👨‍💼 Admin Module

- ✅ Admin dashboard with stats
- ✅ Manage students (view all)
- ✅ Manage companies (view all)
- ✅ Approve/Reject jobs
- ✅ View all applications
- ✅ Company-wise hiring chart

### 💼 Job System

- ✅ Job listing with full details
- ✅ Eligibility filtering (CGPA + Branch)
- ✅ Apply with validation
- ✅ Duplicate application prevention

### 🔔 Notifications

- ✅ Job alerts (when approved)
- ✅ Application status updates
- ✅ Interview schedule alerts
- ✅ Mark as read

### 📊 Dashboard

- ✅ Student: jobs, applications, shortlisted, selected
- ✅ Company: posted jobs, applicants, selections
- ✅ Admin: full stats + company-wise hiring chart

### 🔐 Security

- ✅ JWT Authentication
- ✅ Protected routes (frontend)
- ✅ Role-based API permissions
- ✅ CORS configured
