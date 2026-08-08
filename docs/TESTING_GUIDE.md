# ProSiya LMS - Complete Testing Guide

**Version**: MVP 1.0  
**Date**: 2026-01-21  
**Status**: Ready for Testing ✅

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs/

---

## 👤 Test Accounts

### Default Admin
- **Email**: admin@prosiya.com
- **Password**: adminpassword123
- **Role**: Admin
- **Access**: Full system access

### Create Test Student
1. Go to http://localhost:5173/register
2. Fill in registration form
3. Or use Django admin to create users

---

## 🧪 Test Scenarios

### Scenario 1: Student Registration & Enrollment

#### Steps:
1. Navigate to http://localhost:5173
2. Click "Sign Up" or go to `/register`
3. Fill in registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
   - Check "I agree to terms"
4. Click "Create Account"
5. Should redirect to login page
6. Login with new credentials
7. Should redirect to student dashboard

#### Expected Results:
- ✅ Registration form validates all fields
- ✅ Password confirmation works
- ✅ User is created in database
- ✅ Redirect to login after registration
- ✅ Can login with new credentials
- ✅ Dashboard shows welcome message

---

### Scenario 2: Course Browsing & Enrollment

#### Steps:
1. Login as student
2. Navigate to homepage (/)
3. Click on "Grade E Security" course card
4. Review course details page
5. Click "Enroll Now" button
6. Confirm enrollment
7. Navigate to `/student/dashboard`
8. Verify course appears in "My Courses"

#### Expected Results:
- ✅ Course detail page shows all information
- ✅ Enrollment button is visible
- ✅ Enrollment creates record in database
- ✅ Course appears on dashboard
- ✅ Progress shows 0%

---

### Scenario 3: Lesson Viewing & Completion

#### Steps:
1. From student dashboard, click "Continue Learning" on enrolled course
2. Should navigate to first lesson
3. Watch/read lesson content
4. Click "Complete & Next" button
5. Verify progress updates
6. Navigate through all lessons

#### Expected Results:
- ✅ Lesson player loads correctly
- ✅ Video/document content displays
- ✅ Sidebar shows course curriculum
- ✅ Current lesson is highlighted
- ✅ Completion updates progress
- ✅ Can navigate between lessons

---

### Scenario 4: Assessment Taking

#### Steps:
1. Navigate to `/student/assessments/[assessment-id]`
2. Assessment starts automatically
3. Answer questions using:
   - Multiple choice (radio buttons)
   - True/False
   - Short answer (text area)
4. Use question navigation sidebar
5. Click "Submit Assessment"
6. Confirm submission

#### Expected Results:
- ✅ Timer starts (if timed assessment)
- ✅ Questions display correctly
- ✅ Can select answers
- ✅ Navigation shows answered questions
- ✅ Progress bar updates
- ✅ Submit confirmation modal appears
- ✅ Assessment is graded

---

### Scenario 5: Instructor Evidence Review

#### Steps:
1. Login as instructor (create via Django admin)
2. Navigate to `/instructor/dashboard`
3. Click "Review Evidence"
4. View pending evidence submissions
5. Click "Review Evidence" on a submission
6. Review modal opens with details
7. Add instructor notes
8. Click "Verify & Sign"

#### Expected Results:
- ✅ Evidence list displays
- ✅ Status badges show correctly
- ✅ Performance metrics visible
- ✅ Modal shows all evidence details
- ✅ Can add notes
- ✅ Verification updates status
- ✅ Cryptographic hash displayed

---

### Scenario 6: Admin Certificate Management

#### Steps:
1. Login as admin
2. Navigate to `/admin/dashboard`
3. Click "Manage Certificates"
4. Click "Issue New Certificate"
5. Fill in certificate form:
   - Student ID/Email
   - Course
   - Template
   - Expiry date (optional)
6. Click "Issue Certificate"
7. Verify certificate appears in list
8. Test "Revoke" button

#### Expected Results:
- ✅ Certificate form validates
- ✅ Serial number is auto-generated
- ✅ Certificate is created
- ✅ Status shows "VALID"
- ✅ Can revoke certificate
- ✅ Revoked status updates

---

### Scenario 7: Audit Log Viewing

#### Steps:
1. Login as admin
2. Navigate to `/admin/compliance/audit`
3. Review audit log table
4. Check for recent actions:
   - User logins
   - Course enrollments
   - Certificate issuance
5. Verify hash chain integrity badge

#### Expected Results:
- ✅ All actions are logged
- ✅ Timestamps are accurate
- ✅ User information is captured
- ✅ IP addresses are logged
- ✅ Hash values are displayed
- ✅ Integrity badge shows "Verified"

---

## 🔍 API Testing

### Using API Documentation
1. Navigate to http://localhost:8000/api/docs/
2. Click "Authorize" button
3. Login to get JWT token
4. Test endpoints:

#### Test Authentication
```bash
POST /api/auth/token/
{
  "email": "admin@prosiya.com",
  "password": "adminpassword123"
}
```

#### Test Course List
```bash
GET /api/courses/list/
```

#### Test Enrollment
```bash
POST /api/courses/list/{slug}/enroll/
```

#### Test User Profile
```bash
GET /api/users/me/
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Database Connection Error
**Error**: `OperationalError: could not connect to server`

**Solution**:
```bash
# Check if PostgreSQL is running
# Or use SQLite by updating settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Issue 2: CORS Error
**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
```python
# In backend/core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Issue 3: 404 on API Endpoints
**Error**: `404 Not Found`

**Solution**:
```bash
# Verify URL routing
python manage.py show_urls

# Check that app URLs are included in core/urls.py
```

### Issue 4: Token Expired
**Error**: `401 Unauthorized`

**Solution**:
- Logout and login again
- Token expires after 60 minutes
- Use refresh token endpoint

---

## ✅ Testing Checklist

### Backend
- [ ] All migrations applied successfully
- [ ] Initial data loaded (tenant, superuser, course)
- [ ] API endpoints return 200 OK
- [ ] Authentication works (login/logout)
- [ ] User registration creates user
- [ ] Course enrollment creates record
- [ ] Lesson completion updates progress
- [ ] Evidence verification works
- [ ] Certificate issuance works
- [ ] Audit logs are created

### Frontend
- [ ] Landing page loads
- [ ] Login page works
- [ ] Registration page works
- [ ] Student dashboard displays
- [ ] Course detail page shows info
- [ ] Lesson player works
- [ ] Assessment interface functions
- [ ] Instructor verification page works
- [ ] Admin dashboard accessible
- [ ] Audit log viewer displays
- [ ] Certificate management works

### Design
- [ ] Colors match mockup (Navy + Yellow)
- [ ] Fonts are consistent (Inter)
- [ ] Buttons have correct variants
- [ ] Cards have shadows and hover effects
- [ ] Sidebar navigation works
- [ ] Responsive on mobile
- [ ] Animations are smooth
- [ ] Loading states display

### Security
- [ ] JWT authentication required
- [ ] Role-based access works
- [ ] Students can't access admin pages
- [ ] Instructors can't access admin pages
- [ ] Audit logs are immutable
- [ ] Evidence hashes are generated
- [ ] Passwords are hashed

---

## 📊 Performance Testing

### Load Testing
```bash
# Install locust
pip install locust

# Create locustfile.py
# Run load test
locust -f locustfile.py
```

### Database Queries
```python
# In Django shell
from django.db import connection
from django.test.utils import override_settings

# Enable query logging
# Check number of queries per request
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] Database migrations complete
- [ ] Environment variables set
- [ ] Static files collected
- [ ] Media storage configured
- [ ] Email service configured
- [ ] HTTPS enabled
- [ ] CORS configured for production
- [ ] Debug mode disabled

### Production Settings
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

---

## 📞 Support

For issues or questions:
1. Check this testing guide
2. Review API documentation
3. Check audit logs for errors
4. Contact development team

---

**Testing Status**: Ready for QA ✅  
**Last Updated**: 2026-01-21  
**Version**: MVP 1.0
