# Pending work — student portal and system cleanup

**Status:** in progress  
**Updated:** 14 September 2026  
**Purpose:** Track remaining work after the codebase scan. Tick boxes as items ship. Do not treat `README.md`, `ARCHITECTURE.md`, `docs/ROADMAP.md`, or the `docs/*COMPLETE*` files as current — they describe a Django MVP that is not what is hosted.

## How to use this file

- `[x]` done in the current Firebase product
- `[ ]` still to do
- Keep the **Suggested order** section as the queue. Move items to Done notes at the bottom if useful, but prefer ticking boxes here.

**System of record:** Firebase (Auth, Firestore, Storage, Hosting, Functions). Django at `127.0.0.1:8000` is leftover and must not be required for the hosted student portal.

---

## Already live (do not rebuild)

These are the working product. Later work should plug into this path, not replace it.

- [x] Firebase Auth (email + Google popup)
- [x] Login / register land on `/student/dashboard` without bounce
- [x] Public course catalogue (static `frontend/src/lib/data/courses.ts`)
- [x] Apply to enrol writes Firestore `enrollments` + pending `material_access`
- [x] Admin Applications page (`/admin/study-material`) approve / decline per course
- [x] Student portal shell (`StudentPortalShell`) for learners
- [x] Student Home, My courses, course pack PDFs, Study packs, More (logout)
- [x] Per-course PDF lock in code (`hasCourseAccess` / `resolveCourseAccess`)
- [x] Chat widget (Cloud Functions / Qwen)

**Not done even though the code exists:** deploy Firestore and Storage rules to production so the PDF lock is enforced on the live site.

---

## Suggested order

Work top to bottom. Later phases depend on earlier ones.

### Phase 0 — Production lock and honesty

- [ ] Deploy `firestore.rules` and `storage.rules` so production PDF access matches the portal
- [ ] Confirm a pending student cannot open Storage PDFs on the live project
- [ ] Confirm an approved student can open only that course’s files
- [ ] Stop treating README / architecture / COMPLETE docs as the live spec (replace in Phase 5)

### Phase 1 — One catalogue, dead Django fallbacks

- [ ] Point public home and `/courses` at **one** catalogue (Firestore **or** static, not both live)
- [ ] Remove Django `api.ts` fallback on the homepage (`127.0.0.1:8000`)
- [ ] Remove silent `courseService.enroll` on `/courses/[slug]` (Firestore `enrollmentService` is the real path)
- [ ] Decide admin `/admin/courses`: rebuild on Firestore, or hide the page until then
- [ ] Stop importing unused `frontend/src/lib/services/users.ts`

### Phase 2 — Navigation and missing routes

Fix chrome so staff and learners are not sent to 404s.

**Student**

- [ ] Keep `StudentPortalShell` as the only learner nav
- [ ] Remove or hide student items inside `Sidebar` (learners never use it)
- [ ] Remove `/student/live` link (no page) or build Live classes
- [ ] Add `/forgot-password` or remove the login link
- [ ] Add `/logout` **or** change Sidebar logout to in-page sign-out (student More already logs out in-page)

**Admin Sidebar href mismatches**

- [ ] Certificates: `/admin/certificates` → `/admin/compliance/certificates` (or add a redirect)
- [ ] Audit: `/admin/audit` → `/admin/compliance/audit` (or add a redirect)
- [ ] Hide or build `/admin/tenants`
- [ ] Hide or build `/admin/settings`
- [ ] Hide or build `/admin/courses/create`

**Instructor**

- [ ] Hide dead links: `/instructor/courses`, `/students`, `/assessments`, `/evidence`, `/schedule`
- [ ] Keep `/instructor/dashboard` only if stats are real; otherwise mark as stub or remove fake numbers
- [ ] Keep `/instructor/verification` only if Django is still running; otherwise rebuild on Firebase or hide

### Phase 3 — Student portal: assessments and certificates

Same access gate as PDFs: no test or certificate unless `material_access` is `approved` for that course.

**Assessments**

- [ ] Store assessments in Firestore (rules already exist; UI does not read them)
- [ ] `/student/assessments` lists real tests for approved courses only
- [ ] Replace `/student/assessments/[id]` Django player with a Firebase attempt flow
- [ ] Write attempts to Firestore; gate by course approval
- [ ] Remove Django `/api/assessments` from the hosted app

**Certificates**

- [ ] Issue certificate docs into Firestore `certificates` after verified completion
- [ ] `/student/certificates` reads the student’s certificates (today it is always empty)
- [ ] Admin certificates page reads Firestore, not Django `certificateService`
- [ ] Decide QR / serial / download later; listing first is enough

**Progress**

- [ ] Write lesson / PDF completion back onto `enrollments`
- [ ] Show progress on student dashboard and My courses (today enrollments stay pending with no progress)

### Phase 4 — Lessons vs PDFs

Today the real content is the study PDF pack. The lesson player is a placeholder.

- [ ] Decide: PDFs-only for v1, or real lessons/videos
- [ ] If PDFs-only: remove or un-link `/student/courses/[slug]/lesson/[id]`
- [ ] If lessons: store modules/lessons in Firestore (schema in rules already) and drop `courseService` from the player
- [ ] Do not keep a Django-backed player in production

### Phase 5 — Retire leftovers and docs

- [ ] Stop importing `frontend/src/lib/services/api.ts` from any hosted route
- [ ] Retire or isolate Django-only screens: admin audit, admin certificates, instructor verification, lesson player, assessment `[id]`
- [ ] Confirm Cloudflare chat worker vs Functions knowledge file; keep **one** (`functions/knowledge/prosiya.md` is the deployed copy)
- [ ] Replace Django-MVP docs with one current architecture note
- [ ] Mark or delete stale files so they cannot be followed by mistake:
  - [ ] `README.md` (still Django / Postgres / SSR / MVP complete)
  - [ ] `ARCHITECTURE.md`
  - [ ] `MIGRATION_STATUS.md`
  - [ ] `docs/FIREBASE_MIGRATION_PLAN.md`
  - [ ] `docs/FULL_IMPLEMENTATION_STATUS.md`
  - [ ] `docs/ROADMAP.md`
  - [ ] `docs/*COMPLETE*` and `docs/FINAL_*`

### Phase 6 — Ops around the portal (after core LMS)

- [ ] Admin inbox for chat leads (`chat_leads` is written; no UI)
- [ ] Proof-of-payment capture in-app (today WhatsApp / manual)
- [ ] Settings: password change / reset
- [ ] Notifications (application approved / declined)
- [ ] White-label `tenants` (rules exist; unused)
- [ ] Evidence / audit on Firebase if compliance still required (today Django-only and unwired)

---

## Student portal surfaces

| Surface | Status | Notes |
|---|---|---|
| `/student/dashboard` | Done | Applications vs unlocked |
| `/student/courses` | Done | Gated list |
| `/student/courses/[slug]` | Done | PDFs if approved |
| `/student/study-material` | Done | Authorised packs only |
| `/student/more` | Done | Account + logout |
| `/student/settings` | Partial | Name only |
| `/student/assessments` | Partial | Unlocked courses, no real tests |
| `/student/certificates` | Stub | Always empty |
| `/student/courses/[slug]/lesson/[id]` | Broken | Placeholder + Django |
| `/student/assessments/[id]` | Broken | Django API; not linked from list |
| `/student/live` | Missing | Sidebar only |
| `/logout` | Missing | Sidebar only |
| `/forgot-password` | Missing | Login link only |

---

## What must still tie to the portal

Access rule: signed in ≠ paid ≠ course access. Unlock is per course via `material_access` (`pending` \| `approved` \| `denied`).

- [ ] Assessments (Firestore, same gate)
- [ ] Certificates (Firestore, listed on portal)
- [ ] Progress / completion on enrollments
- [ ] Real lesson content **or** retire the lesson route
- [ ] Forgot password
- [ ] Logout route (or remove the link)
- [ ] Chat leads for admins
- [ ] Payment / proof in-app
- [ ] Notifications

---

## Duplicates to collapse

| Thing | Copies | Keep | Retire |
|---|---|---|---|
| Course catalogue | `data/courses.ts`, Firestore `courses`, Django `/courses/list/` | One catalogue | The other two |
| Enrolment | Firestore `enrollmentService`, Django `courseService.enroll` | Firestore apply | Silent Django enroll |
| Access | `material_access` vs `users.paymentStatus` / `hasPaidAccess` | Per-course applications | Global Paid as unlock (Paid may stay as a payment note) |
| Learner chrome | `StudentPortalShell` vs Sidebar student items | StudentPortalShell | Student entries in Sidebar |
| Chat knowledge | `functions/knowledge/prosiya.md`, `cloudflare/chat-worker` | Deployed Functions copy | The unused copy |
| Docs | ~25 markdown files claiming Django MVP | This file + one architecture note | COMPLETE / ROADMAP / old ARCHITECTURE |

`hasPaidAccess` is unused in student UI. Do not wire it back as an unlock.

---

## Firestore vs UI

| Collection | Written | Student portal reads it | Action |
|---|---|---|---|
| `users` | Auth register / Google | Settings, header | Keep |
| `enrollments` | Apply to enrol | Dashboard, My courses | Keep; add progress later |
| `material_access` | Apply + admin approve | Access gate | Keep — real authorisation |
| `study_materials` | Seed | Unlocked packs | Keep |
| `courses` | Seed | No | Use or stop seeding |
| `assessments` / `attempts` | Rules only | No | Phase 3 |
| `certificates` | Rules only | No | Phase 3 |
| `evidence` / `audit_logs` | Rules only | No | Phase 6 if needed |
| `chat_leads` | Cloud Function | No | Phase 6 admin inbox |
| `tenants` | Unused | No | Phase 6 or drop from rules |

---

## Broken staff links (Phase 2 checklist)

- [ ] `/admin/certificates` vs `/admin/compliance/certificates`
- [ ] `/admin/audit` vs `/admin/compliance/audit`
- [ ] `/admin/tenants`, `/admin/settings`, `/admin/courses/create` — hide or build
- [ ] Instructor `/courses` `/students` `/assessments` `/schedule` `/evidence` — hide or build
- [ ] `/logout`, `/forgot-password`, `/student/live`

---

## Decisions still open

Record the choice here when made so work does not fork.

| Decision | Options | Chosen |
|---|---|---|
| Course catalogue | Static file vs Firestore `courses` | |
| Lesson model | PDFs-only vs Firestore modules/lessons | |
| Django leftover | Isolate until deleted vs delete screens now | |
| Instructor portal | Hide until Firebase vs keep Django locally | |
| Payment | Stay on WhatsApp vs in-app proof | |
| Certificates | List-only vs QR serial download | |

---

## Done log

Add a line when a phase or item ships (date + what changed).

| Date | What |
|---|---|
| 2026-09-14 | Auth bounce fixed; per-course apply/approve/PDF gate in app |
| 2026-09-14 | Codebase scan; this tracker created |
