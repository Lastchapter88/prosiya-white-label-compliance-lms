# ProSiya LMS - Design Quick Reference

> **Quick reference for developers implementing the mockup design**

---

## 🎨 Color Palette

### Primary Colors
```css
--color-navy-dark:    #1a2332   /* Primary navy - sidebars, headers */
--color-navy:         #2d3748   /* Secondary navy - hover states */
--color-navy-light:   #4a5568   /* Tertiary navy - borders, disabled */
--color-yellow:       #FDB913   /* Primary CTA - buttons, accents */
--color-yellow-dark:  #d99b0f   /* Yellow hover state */
```

### Neutral Colors
```css
--color-bg-light:     #F5F5F5   /* Page background */
--color-bg-white:     #FFFFFF   /* Card backgrounds */
--color-text-dark:    #1a1a1a   /* Primary text */
--color-text-gray:    #6b7280   /* Secondary text */
--color-border:       #e5e7eb   /* Borders, dividers */
```

### Semantic Colors
```css
--color-success:      #10b981   /* Success states */
--color-error:        #ef4444   /* Error states */
--color-warning:      #f59e0b   /* Warning states */
--color-live:         #ef4444   /* Live indicator (red) */
```

---

## 📐 Spacing & Sizing

### Spacing Scale
```css
--spacing-xs:   4px    /* 0.25rem */
--spacing-sm:   8px    /* 0.5rem */
--spacing-md:   16px   /* 1rem */
--spacing-lg:   24px   /* 1.5rem */
--spacing-xl:   32px   /* 2rem */
--spacing-2xl:  48px   /* 3rem */
--spacing-3xl:  64px   /* 4rem */
```

### Border Radius
```css
--radius-sm:    4px    /* Small elements */
--radius-md:    8px    /* Cards, buttons */
--radius-lg:    12px   /* Large cards */
--radius-xl:    16px   /* Modals */
--radius-full:  9999px /* Circular elements */
```

### Shadows
```css
--shadow-sm:    0 1px 2px rgba(0,0,0,0.05)
--shadow-md:    0 2px 8px rgba(0,0,0,0.1)
--shadow-lg:    0 4px 16px rgba(0,0,0,0.15)
--shadow-xl:    0 10px 40px rgba(0,0,0,0.2)
```

---

## 🧩 Component Specifications

### Course Card
```
Dimensions: 320px × 400px (flexible)
Image: 320px × 200px (16:9 ratio)
Padding: 24px
Border radius: 12px
Shadow: --shadow-md (hover: --shadow-lg)
Background: white

Elements:
- Course image (top)
- Course title (h3, bold)
- Feature list (checkmarks)
- CTA button (yellow, full-width)
```

### Sidebar Navigation
```
Width: 280px (desktop)
Background: --color-navy-dark
Text color: white
Padding: 24px

Elements:
- User profile section (top)
  - Avatar: 48px × 48px, circular
  - Name: 16px, medium weight
- Navigation items:
  - Height: 48px
  - Padding: 12px 16px
  - Hover: --color-navy
  - Active: --color-yellow accent
```

### Button Variants

**Primary (Yellow)**
```css
background: --color-yellow
color: --color-navy-dark
padding: 12px 24px
border-radius: 8px
font-weight: 600
hover: --color-yellow-dark
```

**Secondary (Navy)**
```css
background: --color-navy-dark
color: white
padding: 12px 24px
border-radius: 8px
font-weight: 600
hover: --color-navy
```

**Outline**
```css
background: transparent
color: --color-navy-dark
border: 2px solid --color-navy-dark
padding: 12px 24px
border-radius: 8px
font-weight: 600
```

### Badge Component
```
Size: 80px × 80px (flexible)
Format: SVG or PNG
Background: white
Border: 1px solid --color-border
Border radius: 8px
Padding: 12px
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack layouts */
  /* Hide sidebar, show hamburger */
  /* Full-width cards */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grids */
  /* Collapsible sidebar */
}

/* Desktop */
@media (min-width: 1025px) {
  /* 3-column grids */
  /* Fixed sidebar */
  /* Max-width: 1400px */
}
```

---

## 🖼️ Image Specifications

### Course Images
- **Dimensions**: 1200px × 800px (3:2 ratio)
- **Format**: JPG or WebP
- **Quality**: 85%
- **File size**: < 200KB
- **Alt text**: Required for accessibility

### Instructor Photos
- **Dimensions**: 400px × 400px (1:1 ratio)
- **Format**: JPG or WebP
- **Style**: Professional headshot, circular crop
- **Background**: Neutral or blurred
- **File size**: < 100KB

### Logos & Badges
- **Format**: SVG (preferred) or PNG
- **Dimensions**: 200px × 200px minimum
- **Background**: Transparent
- **Colors**: Match brand guidelines

### Video Thumbnails
- **Dimensions**: 1280px × 720px (16:9 ratio)
- **Format**: JPG or WebP
- **Overlay**: Play button icon
- **File size**: < 150KB

---

## 📋 Mockup Screen Breakdown

### Screen 1: Landing Page (Top Left)
**Components:**
1. Header with logo and navigation
2. Hero section:
   - Professional trainer image (right side)
   - Headline: "Professional Security & Firearm Training"
   - Certification badges (PSIRA, QCTO, SASSETA)
   - Feature list with checkmarks
   - "Get Started" button (yellow)
3. Course cards section:
   - 3 cards in a row (responsive)
   - Security Training
   - Firearm Training
   - Armed Response
4. Footer with partner logos

### Screen 2: Mobile Enrollment (Top Right)
**Components:**
1. Dark navy background
2. Hero image (firearms training)
3. Login/Sign Up toggle
4. Navigation menu:
   - My Courses
   - Live Classes
   - Certificates
   - Settings

### Screen 3: Student Dashboard (Bottom Left)
**Components:**
1. Dark navy sidebar (left)
   - User profile
   - Navigation menu
2. Main content area:
   - Dashboard header
   - Course enrollment card
   - Upcoming live classes
   - Payment section
3. Payment details:
   - Amount display (R1,8700)
   - Payment methods
   - Transaction details

### Screen 4: Mobile Course View (Bottom Right)
**Components:**
1. Course detail card with video
2. Live stream interface
3. Course information:
   - Title: "REG 21 (Refreshing)"
   - Instructor details
   - Participant list
4. Action buttons:
   - "Enroll" (yellow)
   - "View Complete"

---

## 🎯 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
```css
--text-xs:   12px   /* Small labels */
--text-sm:   14px   /* Body text, secondary */
--text-base: 16px   /* Body text, primary */
--text-lg:   18px   /* Large body */
--text-xl:   20px   /* Small headings */
--text-2xl:  24px   /* H3 */
--text-3xl:  30px   /* H2 */
--text-4xl:  36px   /* H1 */
--text-5xl:  48px   /* Hero headings */
```

### Font Weights
```css
--weight-normal:   400
--weight-medium:   500
--weight-semibold: 600
--weight-bold:     700
--weight-extrabold: 800
```

### Line Heights
```css
--leading-tight:  1.2   /* Headings */
--leading-normal: 1.5   /* Body text */
--leading-relaxed: 1.75 /* Long-form content */
```

---

## ✅ Checklist for Each Component

When creating a new component, ensure:

- [ ] Colors match the design system
- [ ] Spacing uses defined spacing scale
- [ ] Typography follows font specifications
- [ ] Responsive behavior defined
- [ ] Hover/active states implemented
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Loading states (if applicable)
- [ ] Error states (if applicable)
- [ ] Mobile-optimized
- [ ] Cross-browser tested

---

## 🔗 Asset URLs (To Be Generated)

### Logos
- `/static/images/prosiya-logo.svg`
- `/static/images/prosiya-logo-light.svg`

### Badges
- `/static/images/badges/psira.svg`
- `/static/images/badges/qcto.svg`
- `/static/images/badges/sasseta.svg`

### Course Images
- `/static/images/courses/security-training.jpg`
- `/static/images/courses/firearm-training.jpg`
- `/static/images/courses/armed-response.jpg`

### Instructor Photos
- `/static/images/instructors/[name].jpg`

### Icons
- `/static/icons/checkmark.svg`
- `/static/icons/play.svg`
- `/static/icons/live.svg`

---

**Last Updated**: 2026-01-14  
**Version**: 1.0  
**Status**: Active Reference
