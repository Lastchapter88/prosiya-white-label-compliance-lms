# ProSiya White-Label Compliance LMS

> **Compliance-as-a-Service Learning Management System** for the regulated security and firearms training industry.

[![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)]()
[![Django](https://img.shields.io/badge/Django-5.0-green)]()
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0-orange)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)]()

---

## 🎯 Overview

ProSiya LMS is a **compliance-grade**, **multi-tenant** learning management platform designed specifically for private security and firearms training academies in South Africa. Built with regulatory compliance (PSIRA, QCTO, SASSETA) as the foundation, it provides:

- ✅ **Immutable Audit Trail** - Every action logged with hash chaining
- ✅ **Evidence Management** - Firearm competency tracking with SHA-256 hashing
- ✅ **Digital Certificates** - QR-verifiable credentials with unique serial numbers
- ✅ **Multi-Tenancy** - White-label branding per academy
- ✅ **Role-Based Access** - Student, Instructor, Assessor, Admin, Regulator
- ✅ **Regulator Exports** - Automated PSIRA/QCTO/SASSETA reporting

---

## 🏗️ Architecture

### Technology Stack

**Backend**
- Django 5.0 + Django REST Framework
- PostgreSQL 16 (ACID compliance)
- JWT Authentication
- Celery (background tasks)
- S3-compatible storage

**Frontend**
- SvelteKit 2.0 + TypeScript
- Server-Side Rendering (SSR)
- Responsive design (mobile-first)
- Role-based layouts

**Infrastructure**
- Docker containerization
- Nginx reverse proxy
- Redis caching
- PostgreSQL replication

---

## 📁 Project Structure

```
prosiya-lms/
├── backend/                    # Django REST API
│   ├── apps/
│   │   ├── tenants/           # Multi-tenancy & branding
│   │   ├── users/             # Authentication & RBAC
│   │   ├── courses/           # Training content
│   │   ├── assessments/       # Exams & evaluations
│   │   ├── evidence/          # Firearm evidence
│   │   ├── certificates/      # Certificate issuance
│   │   ├── audit/             # Compliance logging
│   │   ├── assets/            # Media management
│   │   └── payments/          # Payment processing
│   └── core/                  # Django settings
├── frontend/                   # SvelteKit application
│   └── src/
│       ├── lib/
│       │   ├── components/    # Reusable UI components
│       │   ├── services/      # API services
│       │   └── stores/        # State management
│       └── routes/
│           ├── (public)/      # Public pages
│           ├── student/       # Student portal
│           ├── instructor/    # Instructor portal
│           └── admin/         # Admin portal
├── docs/                       # Documentation
└── infrastructure/             # Deployment configs
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ (or SQLite for development)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-org/prosiya-lms.git
cd prosiya-lms
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Load initial data
python init_data.py

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs/

### 5. Default Login
- **Email**: admin@prosiya.com
- **Password**: adminpassword123

---

## 📚 Documentation

- **[Architecture](ARCHITECTURE.md)** - System design and principles
- **[Implementation Guide](docs/IMPLEMENTATION_GUIDE.md)** - Development workflow
- **[Testing Guide](docs/TESTING_GUIDE.md)** - QA and testing procedures
- **[Roadmap](docs/ROADMAP.md)** - Development phases
- **[API Documentation](http://localhost:8000/api/docs/)** - Interactive API docs

---

## ✨ Features

### Student Portal
- 📚 Course catalog and enrollment
- 🎥 Video and document lessons
- 📝 Online assessments (multiple choice, true/false, short answer)
- 📊 Progress tracking
- 🎓 Certificate downloads
- 📅 Live class scheduling

### Instructor Portal
- 👥 Student management
- 🎯 Evidence verification
- ✅ Assessment grading
- 📋 Attendance tracking
- 📊 Performance analytics

### Admin Portal
- 🏢 Tenant management
- 👤 User administration
- 📚 Course creation and management
- 🎓 Certificate issuance and revocation
- 🔍 Audit log viewer
- 📊 System analytics

### Compliance Features
- 🔒 Immutable audit logs with hash chaining
- 🔐 SHA-256 evidence hashing
- 📜 Digital certificate verification
- 📤 Regulator export automation
- 🛡️ POPIA compliance
- ⚖️ Court-grade evidence trails

---

## 🎨 Design System

### Colors
- **Primary Navy**: #1a2332
- **Accent Yellow**: #FDB913
- **Success Green**: #10b981
- **Error Red**: #ef4444
- **Warning Orange**: #f59e0b

### Typography
- **Font Family**: Inter
- **Headings**: 700-800 weight
- **Body**: 400-600 weight

### Components
- Buttons (Primary, Accent, Navy, Outline)
- Cards with shadows and hover effects
- Modals with animations
- Badges (Status, Live, Certification)
- Forms with validation

---

## 🔐 Security

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Password hashing (PBKDF2)
- Session management

### Authorization
- Role-based access control (RBAC)
- Permission-based views
- Tenant data isolation
- Row-level security

### Compliance
- Audit logging (all actions)
- Evidence hashing (SHA-256)
- Hash chain verification
- Tamper detection
- POPIA compliance

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

### End-to-End Testing
See [Testing Guide](docs/TESTING_GUIDE.md) for detailed scenarios.

---

## 📦 Deployment

### Production Build

**Backend**
```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic
python manage.py migrate
gunicorn core.wsgi:application
```

**Frontend**
```bash
cd frontend
npm run build
npm run preview
```

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Variables
```env
# Backend
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/prosiya_lms
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com

# Frontend
PUBLIC_API_URL=https://api.your-domain.com
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use TypeScript for frontend
- Write tests for new features
- Update documentation
- Maintain audit trail integrity

---

## 📊 Project Status

### MVP (Phase 1) - ✅ Complete
- [x] User authentication and authorization
- [x] Course management
- [x] Assessment system
- [x] Evidence management
- [x] Certificate issuance
- [x] Audit logging
- [x] Student portal
- [x] Instructor portal
- [x] Admin portal

### Phase 2 - Compliance Hardening
- [ ] Digital signatures
- [ ] Advanced evidence verification
- [ ] Regulator export automation
- [ ] MFA implementation

### Phase 3 - White-Label SaaS
- [ ] Tenant self-onboarding
- [ ] Billing integration
- [ ] Custom domains
- [ ] Multi-regulator profiles

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For questions, issues, or feature requests:
- **Email**: support@prosiya.co.za
- **Documentation**: [docs/](docs/)
- **API Docs**: http://localhost:8000/api/docs/

---

## 🙏 Acknowledgments

- **ProSiya Academy** - Flagship tenant and reference client
- **PSIRA, QCTO, SASSETA** - Regulatory framework
- **Django & SvelteKit Communities** - Excellent frameworks

---

**Built with ❤️ for compliance-grade training**

**Version**: MVP 1.0  
**Last Updated**: 2026-01-21  
**Status**: Production Ready 🚀
