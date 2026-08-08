# ProSiya White-Label Compliance LMS – Architecture & MVP (Design Reference)

> This document is the canonical Markdown reference for the design, architecture, and MVP scope of the ProSiya white‑label, multi‑tenant, compliance‑grade Learning Management Platform for Private Security & Firearms Training.

---

## 1. Vision

Build a **Compliance‑as‑a‑Service LMS** for the regulated security and firearms training industry.

Starting tenant: **ProSiya** (flagship & reference client)
Long‑term: White‑label SaaS for multiple academies across South Africa and Africa.

Key goals:

* Regulator‑ready (PSIRA, QCTO, SASSETA)
* Audit‑defensible (court‑grade evidence trails)
* Multi‑tenant and brand‑customisable
* Web‑first, later mobile

---

## 2. Architectural Principles

1. **Compliance First** – every action is logged, time‑stamped, and auditable.
2. **White‑Label Multi‑Tenancy** – data isolation, custom branding per academy.
3. **Modular Monolith (MVP)** – clean domain boundaries, split later if needed.
4. **Immutable Audit Spine** – append‑only logs, evidence hashing, non‑repudiation.
5. **POPIA & Jurisdiction Control** – local or EU‑locked hosting, encrypted storage.

---

## 3. Technology Stack

### Frontend

* **Framework:** SvelteKit (TypeScript)
* **Features:**

  * SSR for secure portals
  * Role‑based layouts (Student / Instructor / Admin)
  * Tenant theming via CSS variables
  * Asset‑driven branding (logos, banners, certificates)

### Backend

* **Framework:** Django + Django REST Framework
* **Database:** PostgreSQL (ACID, row‑level tenant isolation)
* **Storage:** S3‑compatible object storage (images, videos, certificates, evidence)
* **Auth:** JWT + Refresh, RBAC, MFA (phase 2)

---

## 4. Core Domains

### Identity & Access

* Users: Student, Instructor, Assessor, Admin, Regulator
* RBAC, session tracking, audit logging

### Training

* Courses → Modules → Lessons
* VOD + Live sessions
* Attendance tracking

### Assessment

* Question banks
* Randomised exams
* Practical assessments
* Invigilator sign‑off

### Firearm & Practical Evidence

* Learner ID
* Firearm serial numbers
* Range location
* Date & time
* Photo / video proof
* Instructor & assessor signatures

### Certification

* Unique serials
* QR verification
* Expiry & renewal
* Regulator export packs (PDF, CSV, XML)

### Audit Ledger

* Append‑only events
* Hash‑chained records
* Tamper detection

---

## 5. Digital Assets & Branding

### Theme Model (Per Tenant)

* Primary, secondary, accent colours
* Logos (light/dark)
* Certificate background

### Asset Categories

1. Marketing (hero banners, accreditation logos)
2. Learning (course covers, instructor photos)
3. Live Sessions (thumbnails, recordings)
4. Compliance Evidence (restricted, immutable)

All assets:

* Stored in object storage
* Metadata in DB
* Access‑controlled
* Audited

---

## 6. MVP Functional Scope

### User Flows

1. Student registers & enrolls
2. Watches lessons
3. Attends live class
4. Completes online assessment
5. Completes practical assessment
6. Evidence uploaded & approved
7. Certificate issued (PDF + QR)
8. Admin & regulator can audit

### Admin Capabilities

* Tenant branding manager
* Course & media management
* Instructor & student management
* Assessment approval
* Certificate issuance
* Audit log viewer

---

## 7. Repository & Folder Structure

### Root

```
prosiya-lms/
├── frontend/
├── backend/
├── infrastructure/
├── docs/
└── README.md
```

### Frontend (SvelteKit)

```
frontend/
└── src/
    ├── lib/
    │   ├── components/
    │   ├── layouts/
    │   ├── stores/
    │   ├── services/
    │   └── themes/
    └── routes/
        ├── (public)/
        ├── student/
        ├── instructor/
        └── admin/
```

### Backend (Django)

```
backend/
├── apps/
│   ├── tenants/
│   ├── users/
│   ├── courses/
│   ├── assessments/
│   ├── evidence/
│   ├── certificates/
│   ├── assets/
│   ├── payments/
│   └── audit/
└── core/
```

---

## 8. Build Phases

### Phase 1 – MVP (ProSiya)

* Single tenant
* Full training → assessment → certificate → audit loop

### Phase 2 – Compliance Hardening

* Evidence hashing
* Digital signatures
* Regulator export automation

### Phase 3 – White‑Label SaaS

* Tenant self‑onboarding
* Billing per academy
* Custom domains
* Multiple regulator profiles

---

This Markdown file is the **single source of truth** for what is being built and why. All future implementation must align with this architecture and structure.
