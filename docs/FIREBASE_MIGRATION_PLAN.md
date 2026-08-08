# Firebase Migration Plan: Pro Siya LMS

## Overview
Status: **PLANNED**  
Objective: Full backend migration from Django/PostgreSQL to Firebase Serverless Architecture (Option 2).
Goal: Scalable, high-performance, cost-effective, real-time LMS with reduced maintenance overhead.

---

## 🏗️ Architecture Shift

| Component | Current (Django) | New (Firebase) |
| :--- | :--- | :--- |
| **Authentication** | Django Auth + SimpleJWT | **Firebase Authentication** (Email/Password, Google, Apple) |
| **Database** | PostgreSQL + Django ORM | **Cloud Firestore** (NoSQL, Real-time) |
| **API Logic** | Django REST Framework Views | **Cloud Functions** (Python v2 - Http & Triggers) |
| **Storage** | S3 / Local Media | **Firebase Storage** (Secure, Scalable) |
| **Background Tasks** | Celery + Redis | **Cloud Functions** (Event-driven Triggers & Pub/Sub) |
| **Hosting** | Nginx / VPS | **Firebase Hosting** (Global CDN) |

---

## 🗃️ Firestore Schema Design

### 1. **Users & Profiles** (`users` collection)
*   **Document ID**: `uid` (from Firebase Auth)
*   **Fields**:
    *   `email`: string
    *   `firstName`: string
    *   `lastName`: string
    *   `role`: string ('student' | 'instructor' | 'admin')
    *   `tenantId`: string (reference to `tenants` collection)
    *   `profile`: map (address, bio, qualifications)
    *   `metadata`: map (lastLogin, createdAt)

### 2. **Tenants / Organizations** (`tenants` collection)
*   **Document ID**: `tenantId` (UUID or slug)
*   **Fields**:
    *   `name`: string
    *   `domain`: string
    *   `theme`: map (colors, logos)
    *   `settings`: map (features enabled, compliance rules)

### 3. **Courses & Content** (`courses` collection)
*   **Document ID**: `courseId`
*   **Fields**:
    *   `title`: string
    *   `tenantId`: string
    *   `status`: string ('draft' | 'published')
    *   `modules`: **Sub-collection**
        *   `{moduleId}`
            *   `title`: string
            *   `lessons`: **Sub-collection**
                *   `{lessonId}`
                    *   `title`: string
                    *   `type`: string ('video' | 'quiz' | 'html')
                    *   `content`: map (videoUrl, htmlBody)

### 4. **Enrollments & Progress** (`enrollments` collection)
*   **Document ID**: `enrollmentId` (composite: `uid_courseId` for easy lookup)
*   **Fields**:
    *   `userId`: string
    *   `courseId`: string
    *   `status`: string ('active' | 'completed')
    *   `progress`: number (0-100)
    *   `completedLessons`: array of strings (lessonIds)

### 5. **Assessments & Attempts** (`assessments` & `attempts` collections)
*   `assessments/{assessmentId}`: Configuration (time limit, pass wording)
*   `attempts/{attemptId}`: Student submission
    *   `studentId`: string
    *   `assessmentId`: string
    *   `answers`: map (questionId: answer)
    *   `score`: number
    *   `status`: string

### 6. **Evidence & Compliance** (`evidence` collection)
*   **Document ID**: `evidenceId`
*   **Fields**:
    *   `studentId`: string
    *   `type`: string ('firearm' | 'practical')
    *   `files`: array of maps (url, hash, timestamp)
    *   `hash`: string (SHA-256 of the record for integrity)
    *   `reviews`: array of maps (reviewerId, status, comments)

### 7. **Certificates** (`certificates` collection)
*   **Document ID**: `certificateId`
*   **Fields**:
    *   `serialNumber`: string (unique)
    *   `studentId`: string
    *   `courseId`: string
    *   `issuedAt`: timestamp
    *   `hash`: string (verification hash)

### 8. **Audit Logs** (`audit_logs` collection)
*   **Document ID**: Auto-generated
*   **Fields**:
    *   `action`: string
    *   `actorId`: string
    *   `targetId`: string
    *   `timestamp`: serverTimestamp()
    *   `hash`: string (immutable chain)

---

## 🚀 Implementation Roadmap

### Phase 1: Setup & Core Auth (Day 1)
1.  Initialize Firebase Project.
2.  Enable Authentication (Email/Google).
3.  Set up Firestore Database.
4.  Configure Firebase Hosting for Svelte Frontend.

### Phase 2: Data Migration Script (Day 2-3)
1.  Write a script (`migration_script.py`) to export Django models to JSON.
2.  Write a script to import JSON to Firestore, restructuring data (flattening relations).
3.  Migrate media files from local/S3 to Firebase Storage.

### Phase 3: API Logic Migration (Day 4-10)
1.  **Users**: Create `onUserCreated` trigger to create profile documents.
2.  **Courses**: Create HTTP Cloud Functions for creating/updating courses (admin only).
3.  **Enrollments**: Logic for `enrollStudent`, checking prerequisites.
4.  **Progress**: `updateProgress` function (securely updates stats).

### Phase 4: Frontend Integration (Day 11-20)
1.  Replace API calls (`fetch('/api/v1/...')`) with Firebase SDK (`getDoc`, `txn`).
2.  Implement efficient real-time listeners for dashboards.
3.  Update Auth state management.

### Phase 5: Testing & Cutover (Day 21+)
1.  validate data integrity.
2.  Verify audit logs and evidence hashing.
3.  DNS switch to Firebase Hosting.

---

## ⚠️ Key Considerations
1.  **Security Rules**: Firestore Security Rules are **critical**. We must strictly define who can read/write what.
    *   *Example*: Only users where `request.auth.uid == resource.data.userId` can read their own progress.
2.  **Compliance**: Ensure "Audit Logs" are write-only (no updates/deletes allowed) via rules.
3.  **Cold Starts**: Python Cloud Functions might have cold starts; keep critical paths optimized.
