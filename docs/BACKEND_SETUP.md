# 🔧 Backend API Setup

**Status**: Phase 1 Initial Setup Complete
**Database**: SQLite (Development) - *Postgres recommended for production*
**Authentication**: JWT (SimpleJWT)

---

## 🚀 Getting Started

### 1. Environment Setup

The backend uses a standard Django setup. Dependencies are managed via `requirements.txt`.

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate
```

### 2. Database

We are currently using SQLite for development ease. 
The database is located at `backend/db.sqlite3`.

To reset the database:
```bash
del db.sqlite3
python manage.py migrate
python init_data.py
```

`init_data.py` creates:
- Default Tenant: "ProSiya Academy"
- Superuser: `admin@prosiya.com` / `adminpassword123`
- Sample Course: "Grade E Security"

### 3. Running the Server

```bash
python manage.py runserver
```
Server runs at: http://localhost:8000

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/token/` - Obtain Token (Login)
- `POST /api/auth/token/refresh/` - Refresh Token

### Users
- `POST /api/users/register/` - Register new student
- `GET /api/users/` - Get current user profile (or list if admin)

### Courses
- `GET /api/courses/` - List published courses (Public)
- `GET /api/courses/{id}/` - Get course details

---

## 🛠️ Configuration

### Settings
Key settings in `backend/core/settings.py`:
- `DB_ENGINE`: Controls DB backend (Default: Postgres, set to `django.db.backends.sqlite3` in `.env` for dev)
- `CORS_ALLOWED_ORIGINS`: Frontend URLs allowed to access API
- `REST_FRAMEWORK`: DRF configuration (JWT auth default)

### .env File
```env
DEBUG=True
SECRET_KEY=dev-secret-key...
DB_ENGINE=django.db.backends.sqlite3
```

---

## 📝 Next Steps (Integration)
1. Configure frontend to call these endpoints.
2. Replace mock data in Svelte stores with API calls.
3. Handle JWT token storage (localStorage/cookie).

