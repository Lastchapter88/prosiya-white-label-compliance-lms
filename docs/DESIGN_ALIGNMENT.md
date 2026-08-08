# ProSiya LMS - Design Mockup vs Current Implementation

## 📊 Status Overview

**Last Updated**: 2026-01-14  
**Mockup Received**: Professional multi-screen design  
**Current State**: Basic MVP structure with placeholder homepage

---

## 🎨 Design Mockup Analysis

### Color Palette (From Mockup)

| Element | Color | Hex/RGB |
|---------|-------|---------|
| **Primary Navy** | Deep navy blue | `#1a2332` (approx) |
| **Accent Yellow** | Bright gold/yellow | `#FDB913` (approx) |
| **Background** | Light gray | `#F5F5F5` |
| **Text Dark** | Near black | `#1a1a1a` |
| **Text Light** | White | `#FFFFFF` |
| **Card Background** | White | `#FFFFFF` |

### Typography
- **Primary Font**: Clean sans-serif (appears to be Inter or similar)
- **Headings**: Bold, professional
- **Body**: Regular weight, good readability

### Key Design Elements

#### 1. **Landing Page** (Top Left of Mockup)
- ✅ Hero section with professional trainer image
- ✅ Course certifications badges (PSIRA, QCTO, SASSETA)
- ✅ Bullet-point course highlights with checkmarks
- ✅ Three featured course cards:
  - Security Training
  - Firearm Training
  - Armed Response
- ✅ Partner logos in footer
- ✅ "Get Started" CTA button (yellow)

#### 2. **Mobile Enrollment Modal** (Top Right)
- ✅ Dark navy background
- ✅ Professional imagery (firearms training context)
- ✅ Login/Sign Up toggle buttons
- ✅ Navigation menu items:
  - My Courses
  - Live Classes
  - Certificates
  - Settings

#### 3. **Student Dashboard** (Bottom Left)
- ✅ Dark navy sidebar navigation
- ✅ User profile section with avatar
- ✅ Main content area with:
  - Course enrollment details
  - "Shotgun for Business" course card
  - Upcoming live classes section
  - "Join Live Session" button (yellow)
- ✅ Payment section showing:
  - Amount: R1,8700
  - Payment methods (Card, EFT, Bank Transfer)
  - Payment details

#### 4. **Mobile Course View** (Bottom Right)
- ✅ Course detail cards with video thumbnails
- ✅ Live stream interface with "LIVE" indicator
- ✅ "REG 21 (Refreshing)" course details
- ✅ Instructor information with avatars
- ✅ "Enroll Now" CTA (yellow)
- ✅ "Enroll" and "View Complete" buttons

---

## 🔍 Current Implementation Review

### ✅ What's Already in Place

#### Project Structure
```
✅ Frontend: SvelteKit + TypeScript
✅ Backend: Django + DRF
✅ Database Models: Complete (9 apps)
✅ Multi-tenant architecture
✅ Compliance-first design
```

#### Frontend Setup
```
✅ SvelteKit 5.x configured
✅ TypeScript enabled
✅ Basic routing structure
✅ Global CSS with design tokens
✅ Component directories created
```

#### Current Color Scheme (app.css)
```css
--color-primary: #667eea;      /* Purple - NEEDS UPDATE */
--color-secondary: #764ba2;    /* Purple - NEEDS UPDATE */
--color-accent: #f59e0b;       /* Orange - NEEDS UPDATE */
```

#### Current Homepage
- Simple gradient hero
- Basic feature cards
- Portal navigation links
- Status information

---

## 🎯 Gap Analysis: Mockup vs Implementation

### 🔴 Critical Gaps (Must Fix)

#### 1. **Color Scheme Mismatch**
- **Current**: Purple gradient (#667eea, #764ba2)
- **Mockup**: Navy blue (#1a2332) + Yellow (#FDB913)
- **Action**: Update CSS variables to match mockup

#### 2. **Missing Landing Page Components**
- ❌ Professional hero image/photo
- ❌ Certification badges (PSIRA, QCTO, SASSETA)
- ❌ Course cards with images
- ❌ Partner logos section
- ❌ Professional course imagery

#### 3. **Missing Student Dashboard**
- ❌ Dark navy sidebar layout
- ❌ Course enrollment cards
- ❌ Live class schedule
- ❌ Payment integration UI
- ❌ Video player interface

#### 4. **Missing Mobile Views**
- ❌ Mobile-optimized enrollment flow
- ❌ Mobile course detail pages
- ❌ Mobile navigation menu

#### 5. **Missing Assets**
- ❌ ProSiya logo
- ❌ Certification badges (PSIRA, QCTO, SASSETA)
- ❌ Course images (security, firearms, armed response)
- ❌ Instructor photos
- ❌ Training environment photos

### 🟡 Medium Priority Gaps

#### 6. **Component Library**
- ❌ Course card component
- ❌ Sidebar navigation component
- ❌ Video player component
- ❌ Payment form component
- ❌ Live class card component
- ❌ Modal/dialog component

#### 7. **Authentication Flow**
- ❌ Login page matching mockup design
- ❌ Registration page
- ❌ Password reset flow

#### 8. **Instructor Portal**
- ❌ Instructor dashboard
- ❌ Student management
- ❌ Evidence review interface

#### 9. **Admin Portal**
- ❌ Admin dashboard
- ❌ User management
- ❌ Course management
- ❌ Certificate issuance

### 🟢 Low Priority (Future Enhancements)

#### 10. **Advanced Features**
- ❌ Live streaming integration
- ❌ Video conferencing
- ❌ Real-time notifications
- ❌ Mobile apps

---

## 📋 Implementation Roadmap

### Phase 1: Design System Alignment (Week 1)

#### Step 1.1: Update Color Scheme
```css
/* Update app.css */
--color-primary: #1a2332;      /* Navy blue */
--color-secondary: #2d3748;    /* Lighter navy */
--color-accent: #FDB913;       /* Yellow/gold */
--color-success: #10b981;      /* Keep green */
--color-error: #ef4444;        /* Keep red */
```

#### Step 1.2: Generate Missing Assets
- [ ] Create ProSiya logo (text + icon)
- [ ] Generate certification badges (PSIRA, QCTO, SASSETA)
- [ ] Generate course images:
  - Security training scene
  - Firearm training scene
  - Armed response scene
- [ ] Generate instructor photos
- [ ] Generate training environment photos

#### Step 1.3: Create Core Components
- [ ] `CourseCard.svelte` - Course display card
- [ ] `Sidebar.svelte` - Navigation sidebar
- [ ] `Header.svelte` - Top navigation
- [ ] `Button.svelte` - Button variants
- [ ] `Badge.svelte` - Certification badges
- [ ] `Modal.svelte` - Modal dialogs

### Phase 2: Landing Page (Week 1-2)

#### Step 2.1: Hero Section
- [ ] Professional hero image
- [ ] Main headline and subheadline
- [ ] Certification badges display
- [ ] Course highlights with checkmarks
- [ ] "Get Started" CTA button

#### Step 2.2: Course Showcase
- [ ] Three featured course cards
- [ ] Course images and descriptions
- [ ] "View Course" buttons
- [ ] Responsive grid layout

#### Step 2.3: Footer
- [ ] Partner logos (PSIRA, QCTO, SASSETA)
- [ ] Contact information
- [ ] Social links

### Phase 3: Student Portal (Week 2-3)

#### Step 3.1: Dashboard Layout
- [ ] Dark navy sidebar
- [ ] User profile section
- [ ] Main content area
- [ ] Responsive mobile menu

#### Step 3.2: Course Enrollment
- [ ] My courses list
- [ ] Course progress tracking
- [ ] Enrollment cards with images
- [ ] Continue learning buttons

#### Step 3.3: Live Classes
- [ ] Upcoming classes schedule
- [ ] Join live session functionality
- [ ] Class recordings

#### Step 3.4: Certificates
- [ ] Certificate list
- [ ] Download/view certificates
- [ ] QR code verification

### Phase 4: Authentication (Week 3)

#### Step 4.1: Login Page
- [ ] Match mockup design
- [ ] Email/password fields
- [ ] "Remember me" checkbox
- [ ] Social login options
- [ ] "Forgot password" link

#### Step 4.2: Registration
- [ ] Multi-step form
- [ ] Field validation
- [ ] Terms acceptance
- [ ] Email verification

### Phase 5: Payment Integration (Week 4)

#### Step 5.1: Payment UI
- [ ] Payment amount display
- [ ] Payment method selection
- [ ] Card payment form
- [ ] EFT details
- [ ] Bank transfer instructions

#### Step 5.2: Payment Processing
- [ ] Integration with payment gateway
- [ ] Transaction tracking
- [ ] Receipt generation

### Phase 6: Instructor & Admin Portals (Week 5-6)

#### Step 6.1: Instructor Dashboard
- [ ] Course management
- [ ] Student list
- [ ] Evidence review
- [ ] Assessment grading

#### Step 6.2: Admin Dashboard
- [ ] System overview
- [ ] User management
- [ ] Course management
- [ ] Audit logs

---

## 🛠️ Technical Implementation Notes

### Design System Updates Required

#### 1. CSS Variables (app.css)
```css
:root {
  /* Brand Colors - Updated to match mockup */
  --color-navy-dark: #1a2332;
  --color-navy: #2d3748;
  --color-navy-light: #4a5568;
  --color-yellow: #FDB913;
  --color-yellow-dark: #d99b0f;
  
  /* Backgrounds */
  --color-bg-light: #F5F5F5;
  --color-bg-white: #FFFFFF;
  
  /* Shadows - Enhanced */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-modal: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

#### 2. Component Patterns

**Course Card**
```svelte
<div class="course-card">
  <img src={courseImage} alt={courseTitle} />
  <div class="course-content">
    <h3>{courseTitle}</h3>
    <ul class="course-features">
      {#each features as feature}
        <li>✓ {feature}</li>
      {/each}
    </ul>
    <button class="btn-yellow">View Course</button>
  </div>
</div>
```

**Sidebar Navigation**
```svelte
<aside class="sidebar-navy">
  <div class="user-profile">
    <img src={userAvatar} alt={userName} />
    <span>{userName}</span>
  </div>
  <nav>
    <a href="/student/dashboard">Dashboard</a>
    <a href="/student/courses">My Courses</a>
    <a href="/student/live">Live Classes</a>
    <a href="/student/certificates">Certificates</a>
    <a href="/student/settings">Settings</a>
  </nav>
</aside>
```

#### 3. Asset Requirements

**Logos & Badges**
- ProSiya logo (SVG, PNG in multiple sizes)
- PSIRA accreditation badge
- QCTO accreditation badge
- SASSETA accreditation badge

**Course Images** (1200x800px recommended)
- Security training: Professional guards in uniform
- Firearm training: Range training scene
- Armed response: Tactical training scene

**Instructor Photos** (400x400px, circular crop)
- Professional headshots
- Consistent lighting and background

**UI Elements**
- Video player thumbnail overlays
- Live streaming indicators
- Payment method icons

---

## 📊 Progress Tracking

### Current Status: **10% Complete**

| Component | Status | Priority |
|-----------|--------|----------|
| Color scheme | ❌ Not aligned | 🔴 Critical |
| Landing page | ⚠️ Basic only | 🔴 Critical |
| Student dashboard | ❌ Not started | 🔴 Critical |
| Authentication | ❌ Not started | 🔴 Critical |
| Course cards | ❌ Not started | 🔴 Critical |
| Assets/images | ❌ Not started | 🔴 Critical |
| Sidebar nav | ❌ Not started | 🟡 Medium |
| Payment UI | ❌ Not started | 🟡 Medium |
| Instructor portal | ❌ Not started | 🟡 Medium |
| Admin portal | ❌ Not started | 🟡 Medium |
| Live streaming | ❌ Not started | 🟢 Low |

### Next Immediate Actions

1. **Update color scheme** in `app.css` to match mockup
2. **Generate core assets** (logo, badges, course images)
3. **Create component library** (CourseCard, Sidebar, Header)
4. **Rebuild landing page** to match mockup exactly
5. **Implement student dashboard** with navy sidebar

---

## 🎯 Success Criteria

### MVP Complete When:
- ✅ Landing page matches mockup design
- ✅ Color scheme aligned (navy + yellow)
- ✅ All core assets generated
- ✅ Student dashboard functional
- ✅ Course enrollment flow working
- ✅ Authentication implemented
- ✅ Mobile responsive design
- ✅ Professional, polished UI

---

## 📞 Questions for Stakeholder

1. **Logo**: Do you have an existing ProSiya logo, or should we create one?
2. **Certifications**: Do you have official PSIRA/QCTO/SASSETA badge images?
3. **Photography**: Do you have professional photos of training sessions, or should we generate them?
4. **Branding**: Are there any other brand guidelines (fonts, specific colors) we should follow?
5. **Payment**: Which payment gateway should we integrate (PayFast, Stripe, other)?

---

**This document serves as the alignment guide between the mockup design and current implementation. All frontend development should reference this document to ensure design consistency.**
