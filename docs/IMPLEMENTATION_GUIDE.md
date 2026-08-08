# ProSiya LMS - MVP Implementation Guide

## 🎯 Project Status

✅ **Architecture Defined** - Complete system design documented
✅ **Project Structure Created** - Frontend and backend scaffolded
✅ **Core Models Implemented** - All database models created
✅ **Configuration Ready** - Django settings and environment setup complete

## 📁 Project Structure

```
prosiya-lms/
├── frontend/               # SvelteKit TypeScript application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── layouts/       # Layout components
│   │   │   ├── stores/        # Svelte stores for state
│   │   │   ├── services/      # API services
│   │   │   └── themes/        # Tenant theming
│   │   └── routes/
│   │       ├── (public)/      # Public pages
│   │       ├── student/       # Student portal
│   │       ├── instructor/    # Instructor portal
│   │       └── admin/         # Admin portal
│   └── package.json
├── backend/                # Django REST API
│   ├── apps/
│   │   ├── tenants/       # Multi-tenancy & branding
│   │   ├── users/         # Authentication & RBAC
│   │   ├── courses/       # Training content
│   │   ├── assessments/   # Exams & evaluations
│   │   ├── evidence/      # Firearm & practical evidence
│   │   ├── certificates/  # Certificate issuance
│   │   ├── assets/        # Media management
│   │   ├── payments/      # Payment processing
│   │   └── audit/         # Compliance logging
│   ├── core/              # Django settings & config
│   ├── manage.py
│   └── requirements.txt
├── infrastructure/         # Deployment configs
├── docs/                  # Documentation
├── ARCHITECTURE.md        # System architecture
└── README.md
```

## 🚀 Next Steps

### 1. Backend Setup

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from env.example)
# Update database credentials

# Create database
# In PostgreSQL:
# CREATE DATABASE prosiya_lms;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:5173
```

### 3. Database Setup

Install PostgreSQL and create the database:

```sql
CREATE DATABASE prosiya_lms;
CREATE USER prosiya_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE prosiya_lms TO prosiya_user;
```

### 4. Initial Data

Create initial tenant (ProSiya):

```python
# In Django shell: python manage.py shell

from apps.tenants.models import Tenant, TenantTheme, TenantSettings

# Create ProSiya tenant
tenant = Tenant.objects.create(
    name="ProSiya Academy",
    slug="prosiya",
    email="info@prosiya.co.za",
    phone="+27785236606",
    street_address="123 Training Street",
    city="Durban",
    province="KwaZulu-Natal",
    postal_code="4000",
    country="South Africa",
    registration_number="2024/123456/07",
    psira_accreditation="PSIRA-12345",
    status="active"
)

# Create theme
theme = TenantTheme.objects.create(
    tenant=tenant,
    primary_color="#667eea",
    secondary_color="#764ba2",
    accent_color="#f59e0b"
)

# Create settings
settings = TenantSettings.objects.create(
    tenant=tenant,
    admin_email="admin@prosiya.co.za"
)
```

## 📋 Implementation Checklist

### Phase 1: MVP Core (Current)

- [x] Project structure
- [x] Database models
- [x] Django configuration
- [x] SvelteKit setup
- [ ] API endpoints (serializers & views)
- [ ] Authentication flow
- [ ] Student portal UI
- [ ] Instructor portal UI
- [ ] Admin portal UI
- [ ] Course management
- [ ] Assessment system
- [ ] Certificate generation

### Phase 2: Compliance Hardening

- [ ] Evidence hashing implementation
- [ ] Digital signatures
- [ ] Audit log verification
- [ ] Regulator export automation
- [ ] POPIA compliance features

### Phase 3: White-Label SaaS

- [ ] Tenant onboarding flow
- [ ] Billing integration
- [ ] Custom domain support
- [ ] Multi-regulator profiles

## 🔧 Development Workflow

### Creating a New App Feature

1. **Backend (Django)**
   - Create models in `apps/<app>/models.py`
   - Create serializers in `apps/<app>/serializers.py`
   - Create views in `apps/<app>/views.py`
   - Add URLs in `apps/<app>/urls.py`
   - Run migrations: `python manage.py makemigrations && python manage.py migrate`

2. **Frontend (SvelteKit)**
   - Create API service in `src/lib/services/`
   - Create components in `src/lib/components/`
   - Create routes in `src/routes/`
   - Add stores if needed in `src/lib/stores/`

### Testing

```bash
# Backend tests
python manage.py test

# Frontend tests
npm run test
```

## 🎨 Design System

The application uses a comprehensive design system defined in `frontend/src/app.css`:

- **Colors**: Primary (#667eea), Secondary (#764ba2), Accent (#f59e0b)
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale (xs to 2xl)
- **Components**: Buttons, cards, forms with consistent styling

## 🔐 Security Considerations

1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Data Isolation**: Row-level tenant isolation
4. **Audit Logging**: All actions logged with hash chaining
5. **Evidence Integrity**: SHA-256 hashing for immutability
6. **POPIA Compliance**: Data protection and privacy controls

## 📚 Key Models

### Users
- Custom user model with roles (Student, Instructor, Assessor, Admin, Regulator)
- User profiles with extended information
- Session tracking for audit

### Tenants
- Multi-tenant architecture
- Custom branding per tenant
- Configurable settings

### Courses
- Hierarchical structure: Course → Module → Lesson
- Progress tracking
- Enrollment management

### Assessments
- Question banks
- Randomized exams
- Practical assessments
- Attempt tracking

### Evidence
- Firearm training evidence
- Photo/video evidence with hashing
- Digital signatures
- Review workflow

### Certificates
- Unique serial numbers
- QR code verification
- Expiry tracking
- Regulator exports

### Audit
- Immutable audit logs
- Hash-chained records
- Compliance events
- Data export tracking

## 🌐 API Endpoints (To Be Implemented)

```
/api/auth/token/              # JWT token obtain
/api/auth/token/refresh/      # JWT token refresh
/api/users/                   # User management
/api/courses/                 # Course CRUD
/api/enrollments/             # Student enrollments
/api/assessments/             # Assessment management
/api/evidence/                # Evidence submission
/api/certificates/            # Certificate issuance
/api/audit/                   # Audit log access
```

## 📖 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **API Docs**: Available at `/api/docs/` when server is running
- **Schema**: Available at `/api/schema/`

## 🤝 Contributing

1. Follow the architecture principles
2. Maintain compliance-first approach
3. Document all changes
4. Write tests for new features
5. Keep audit trails intact

## 📞 Support

For questions or issues, contact the development team.

---

**Last Updated**: 2026-01-13
**Version**: MVP v1.0
**Status**: In Development
