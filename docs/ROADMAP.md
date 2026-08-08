# ProSiya LMS - Development Roadmap

## 🎯 Current Status: Design Mockup Received ✅

The project architecture, database models, and initial structure are complete. **A professional design mockup has been provided** showing the target UI/UX. This roadmap has been updated to prioritize design implementation.

---

## Phase 0: Design System Implementation (CURRENT PRIORITY - Week 1)

### 0.1 Design Alignment & Asset Generation
- [ ] Review design mockup and create alignment document ✅ **COMPLETE**
- [ ] Update color scheme to match mockup (Navy #1a2332 + Yellow #FDB913)
- [ ] Generate ProSiya logo (or obtain existing)
- [ ] Generate/obtain certification badges (PSIRA, QCTO, SASSETA)
- [ ] Generate course imagery:
  - [ ] Security Training scene
  - [ ] Firearm Training scene
  - [ ] Armed Response scene
- [ ] Generate instructor photos
- [ ] Generate training environment photos

### 0.2 Core Component Library
- [ ] Create `CourseCard.svelte` - Course display cards with images
- [ ] Create `Sidebar.svelte` - Dark navy navigation sidebar
- [ ] Create `Header.svelte` - Top navigation bar
- [ ] Create `Button.svelte` - Button variants (primary yellow, secondary navy)
- [ ] Create `Badge.svelte` - Certification badges
- [ ] Create `Modal.svelte` - Modal dialogs
- [ ] Create `VideoPlayer.svelte` - Video player component
- [ ] Create `PaymentCard.svelte` - Payment UI component

### 0.3 Landing Page (Matching Mockup)
- [ ] Rebuild hero section with:
  - [ ] Professional trainer image
  - [ ] Main headline and value proposition
  - [ ] Certification badges (PSIRA, QCTO, SASSETA)
  - [ ] Course highlights with checkmarks
  - [ ] "Get Started" CTA button (yellow)
- [ ] Create course showcase section:
  - [ ] Three featured course cards with images
  - [ ] Security Training card
  - [ ] Firearm Training card
  - [ ] Armed Response card
- [ ] Create footer with partner logos

### 0.4 Student Dashboard Layout
- [ ] Create dark navy sidebar layout
- [ ] Add user profile section with avatar
- [ ] Create dashboard main content area
- [ ] Add "My Courses" section with enrollment cards
- [ ] Add "Upcoming Live Classes" section
- [ ] Add mobile-responsive navigation menu

---

## Phase 1: MVP Core Features

### Week 2-3: Backend API Development

#### 1.1 User Authentication & Authorization
- [ ] Create user serializers (`apps/users/serializers.py`)
  - UserSerializer
  - UserProfileSerializer
  - UserRegistrationSerializer
  - UserLoginSerializer
- [ ] Implement authentication views (`apps/users/views.py`)
  - Registration endpoint
  - Login endpoint (JWT)
  - Token refresh endpoint
  - User profile CRUD
  - Password reset flow
- [ ] Add URL routing (`apps/users/urls.py`)
- [ ] Write tests for authentication

#### 1.2 Tenant Management
- [ ] Create tenant serializers (`apps/tenants/serializers.py`)
  - TenantSerializer
  - TenantThemeSerializer
  - TenantSettingsSerializer
- [ ] Implement tenant views (`apps/tenants/views.py`)
  - Tenant CRUD (admin only)
  - Theme management
  - Settings management
- [ ] Add URL routing (`apps/tenants/urls.py`)

#### 1.3 Course Management
- [ ] Create course serializers (`apps/courses/serializers.py`)
  - CourseSerializer
  - ModuleSerializer
  - LessonSerializer
  - EnrollmentSerializer
  - LessonProgressSerializer
- [ ] Implement course views (`apps/courses/views.py`)
  - Course CRUD
  - Module CRUD
  - Lesson CRUD
  - Enrollment management
  - Progress tracking
- [ ] Add URL routing (`apps/courses/urls.py`)

#### 1.4 Assessment System
- [ ] Create assessment serializers (`apps/assessments/serializers.py`)
  - QuestionBankSerializer
  - AssessmentSerializer
  - AssessmentAttemptSerializer
  - PracticalAssessmentSerializer
- [ ] Implement assessment views (`apps/assessments/views.py`)
  - Question bank CRUD
  - Assessment CRUD
  - Start assessment
  - Submit assessment
  - Grade assessment
  - Practical assessment management
- [ ] Add URL routing (`apps/assessments/urls.py`)

#### 1.5 Evidence Management
- [ ] Create evidence serializers (`apps/evidence/serializers.py`)
  - FirearmEvidenceSerializer
  - EvidenceFileSerializer
  - EvidenceReviewSerializer
- [ ] Implement evidence views (`apps/evidence/views.py`)
  - Evidence submission
  - File upload
  - Evidence review
  - Approval workflow
- [ ] Add URL routing (`apps/evidence/urls.py`)

#### 1.6 Certificate System
- [ ] Create certificate serializers (`apps/certificates/serializers.py`)
  - CertificateSerializer
  - CertificateVerificationSerializer
  - RegulatorExportSerializer
- [ ] Implement certificate views (`apps/certificates/views.py`)
  - Certificate issuance
  - QR code generation
  - Certificate verification
  - PDF generation
  - Regulator export
- [ ] Add URL routing (`apps/certificates/urls.py`)

#### 1.7 Audit & Compliance
- [ ] Create audit serializers (`apps/audit/serializers.py`)
  - AuditLogSerializer
  - ComplianceEventSerializer
  - DataExportSerializer
- [ ] Implement audit views (`apps/audit/views.py`)
  - Audit log viewer (admin/regulator)
  - Compliance event tracking
  - Data export
- [ ] Add URL routing (`apps/audit/urls.py`)

### Week 3-4: Frontend Development

#### 2.1 API Service Layer
- [ ] Create API client (`src/lib/services/api.ts`)
  - Base API configuration
  - Request/response interceptors
  - Error handling
- [ ] Create service modules:
  - [ ] `src/lib/services/auth.ts` - Authentication
  - [ ] `src/lib/services/courses.ts` - Course management
  - [ ] `src/lib/services/assessments.ts` - Assessments
  - [ ] `src/lib/services/evidence.ts` - Evidence
  - [ ] `src/lib/services/certificates.ts` - Certificates

#### 2.2 State Management
- [ ] Create stores (`src/lib/stores/`)
  - [ ] `auth.ts` - User authentication state
  - [ ] `tenant.ts` - Tenant/theme state
  - [ ] `courses.ts` - Course data
  - [ ] `notifications.ts` - Toast notifications

#### 2.3 Shared Components
- [ ] Create UI components (`src/lib/components/`)
  - [ ] `Header.svelte` - Navigation header
  - [ ] `Sidebar.svelte` - Side navigation
  - [ ] `Card.svelte` - Card component
  - [ ] `Button.svelte` - Button variants
  - [ ] `Input.svelte` - Form inputs
  - [ ] `Modal.svelte` - Modal dialogs
  - [ ] `Table.svelte` - Data tables
  - [ ] `Pagination.svelte` - Pagination
  - [ ] `LoadingSpinner.svelte` - Loading states
  - [ ] `Toast.svelte` - Notifications

#### 2.4 Authentication Flow
- [ ] Create auth pages (`src/routes/(public)/`)
  - [ ] `login/+page.svelte` - Login page
  - [ ] `register/+page.svelte` - Registration page
  - [ ] `forgot-password/+page.svelte` - Password reset
- [ ] Implement auth guards
- [ ] Add role-based routing

#### 2.5 Student Portal
- [ ] Create student routes (`src/routes/student/`)
  - [ ] `+layout.svelte` - Student layout
  - [ ] `dashboard/+page.svelte` - Student dashboard
  - [ ] `courses/+page.svelte` - Course catalog
  - [ ] `courses/[id]/+page.svelte` - Course detail
  - [ ] `courses/[id]/learn/+page.svelte` - Learning interface
  - [ ] `assessments/+page.svelte` - Assessment list
  - [ ] `assessments/[id]/+page.svelte` - Take assessment
  - [ ] `certificates/+page.svelte` - My certificates
  - [ ] `profile/+page.svelte` - Profile management

#### 2.6 Instructor Portal
- [ ] Create instructor routes (`src/routes/instructor/`)
  - [ ] `+layout.svelte` - Instructor layout
  - [ ] `dashboard/+page.svelte` - Instructor dashboard
  - [ ] `courses/+page.svelte` - My courses
  - [ ] `courses/[id]/+page.svelte` - Course management
  - [ ] `students/+page.svelte` - Student list
  - [ ] `assessments/+page.svelte` - Assessment management
  - [ ] `evidence/+page.svelte` - Evidence review
  - [ ] `schedule/+page.svelte` - Class schedule

#### 2.7 Admin Portal
- [ ] Create admin routes (`src/routes/admin/`)
  - [ ] `+layout.svelte` - Admin layout
  - [ ] `dashboard/+page.svelte` - Admin dashboard
  - [ ] `users/+page.svelte` - User management
  - [ ] `courses/+page.svelte` - Course management
  - [ ] `tenants/+page.svelte` - Tenant management
  - [ ] `certificates/+page.svelte` - Certificate management
  - [ ] `audit/+page.svelte` - Audit logs
  - [ ] `reports/+page.svelte` - Reports & analytics
  - [ ] `settings/+page.svelte` - System settings

### Week 5: Integration & Testing

#### 3.1 Database Setup
- [ ] Install PostgreSQL
- [ ] Create database
- [ ] Run migrations
- [ ] Create initial tenant (ProSiya)
- [ ] Create test users
- [ ] Seed test data

#### 3.2 Testing
- [ ] Backend unit tests
  - [ ] Model tests
  - [ ] Serializer tests
  - [ ] View tests
  - [ ] Authentication tests
- [ ] Frontend tests
  - [ ] Component tests
  - [ ] Integration tests
- [ ] End-to-end tests
  - [ ] User registration flow
  - [ ] Course enrollment flow
  - [ ] Assessment flow
  - [ ] Certificate issuance flow

#### 3.3 Documentation
- [ ] API documentation (Swagger)
- [ ] User guides
  - [ ] Student guide
  - [ ] Instructor guide
  - [ ] Admin guide
- [ ] Developer documentation

---

## Phase 2: Compliance Hardening (Post-MVP)

### 4.1 Evidence Integrity
- [ ] Implement SHA-256 hashing for all evidence
- [ ] Add hash verification endpoints
- [ ] Create tamper detection system

### 4.2 Digital Signatures
- [ ] Implement digital signature generation
- [ ] Add signature verification
- [ ] Create signature audit trail

### 4.3 Regulator Automation
- [ ] PSIRA export automation
- [ ] QCTO export automation
- [ ] SASSETA export automation
- [ ] Scheduled export jobs

### 4.4 Advanced Audit
- [ ] Audit log verification
- [ ] Hash chain validation
- [ ] Compliance reporting dashboard

---

## Phase 3: White-Label SaaS (Future)

### 5.1 Tenant Onboarding
- [ ] Self-service tenant registration
- [ ] Onboarding wizard
- [ ] Tenant verification

### 5.2 Billing System
- [ ] Payment integration (Stripe/PayFast)
- [ ] Subscription management
- [ ] Invoice generation
- [ ] Usage tracking

### 5.3 Advanced Features
- [ ] Custom domain support
- [ ] Multi-regulator profiles
- [ ] Advanced analytics
- [ ] Mobile apps

---

## Quick Start Commands

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```sql
CREATE DATABASE prosiya_lms;
CREATE USER prosiya_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE prosiya_lms TO prosiya_user;
```

---

## Success Criteria

### MVP Complete When:
- ✅ All API endpoints functional
- ✅ Authentication working
- ✅ Student can enroll and complete course
- ✅ Assessments can be taken and graded
- ✅ Evidence can be submitted and reviewed
- ✅ Certificates can be issued and verified
- ✅ Admin can manage all entities
- ✅ Audit logs capturing all actions

---

**Last Updated**: 2026-01-13
**Current Phase**: Phase 1 - MVP Core Features
**Next Milestone**: Complete Backend API (Week 1-2)
