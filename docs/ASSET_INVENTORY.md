# 🎨 ProSiya LMS - Asset Inventory

**Generated**: 2026-01-14 13:35  
**Status**: All Core Assets Generated ✅  
**Total Assets**: 8 images

---

## 📁 Asset Directory Structure

```
frontend/static/images/
├── logos/
│   └── prosiya-logo.png          ✅ Generated
├── badges/
│   ├── psira.png                 ✅ Generated
│   ├── qcto.png                  ✅ Generated
│   └── sasseta.png               ✅ Generated
├── courses/
│   ├── security-training.png     ✅ Generated
│   ├── firearm-training.png      ✅ Generated
│   └── armed-response.png        ✅ Generated
└── instructors/
    └── instructor-1.png          ✅ Generated
```

---

## 🎨 Asset Details

### 1. ProSiya Logo
**File**: `static/images/logos/prosiya-logo.png`  
**Description**: Professional logo with shield and target crosshairs design  
**Colors**: Navy blue (#1a2332) and gold (#FDB913)  
**Size**: Square format, suitable for headers and branding  
**Usage**: 
- Website header
- Email signatures
- Course materials
- Certificates

---

### 2. PSIRA Accreditation Badge
**File**: `static/images/badges/psira.png`  
**Description**: Private Security Industry Regulatory Authority badge  
**Design**: Circular badge with South African flag colors and eagle emblem  
**Text**: "PSIRA - Accredited Training Provider"  
**Usage**:
- Landing page accreditation section
- Course pages
- Certificates
- Marketing materials

---

### 3. QCTO Accreditation Badge
**File**: `static/images/badges/qcto.png`  
**Description**: Quality Council for Trades and Occupations badge  
**Design**: Circular badge with laurel wreaths and quality symbols  
**Text**: "QCTO - Quality Assured"  
**Usage**:
- Landing page accreditation section
- Course pages
- Certificates
- Marketing materials

---

### 4. SASSETA Accreditation Badge
**File**: `static/images/badges/sasseta.png`  
**Description**: Safety and Security Sector Education and Training Authority badge  
**Design**: Circular badge with eagle and anchor emblem  
**Text**: "SASSETA - Accredited Training Provider - South Africa"  
**Usage**:
- Landing page accreditation section
- Course pages
- Certificates
- Marketing materials

---

### 5. Security Training Course Image
**File**: `static/images/courses/security-training.png`  
**Description**: Professional diverse security team in navy uniforms  
**Scene**: Three security officers in modern training facility  
**Aspect Ratio**: 16:9 (suitable for course cards)  
**Usage**:
- Security Training course card
- Course detail page
- Marketing materials

**Course Features** (to display with this image):
- Security Grades E - A
- Firearm Competency
- Armed Response & CIT
- Online + Practical Training

---

### 6. Firearm Training Course Image
**File**: `static/images/courses/firearm-training.png`  
**Description**: Professional firearms training at shooting range  
**Scene**: Instructor teaching student proper handgun technique  
**Safety**: Student wearing safety glasses and ear protection  
**Aspect Ratio**: 16:9 (suitable for course cards)  
**Usage**:
- Firearm Training course card
- Course detail page
- Marketing materials

**Course Features** (to display with this image):
- Firearm Competency
- Firearm Refresher
- Armed Response & CIT
- Cash-in-Transit

---

### 7. Armed Response Course Image
**File**: `static/images/courses/armed-response.png`  
**Description**: Professional tactical training exercise  
**Scene**: Tactical team in advanced training scenario  
**Environment**: Professional training facility with targets  
**Aspect Ratio**: 16:9 (suitable for course cards)  
**Usage**:
- Armed Response course card
- Course detail page
- Marketing materials

**Course Features** (to display with this image):
- Minimum Profiling Armor
- Ballistic Shoulder Charge
- Firearm Response
- Firearm Refresher

---

### 8. Instructor Photo
**File**: `static/images/instructors/instructor-1.png`  
**Description**: Professional instructor headshot  
**Appearance**: Middle-aged instructor in navy polo with security badge  
**Expression**: Friendly but authoritative  
**Aspect Ratio**: Square (suitable for profile photos)  
**Usage**:
- Instructor profiles
- Course pages
- About page
- Testimonials

**Suggested Instructor Info**:
- Name: [To be customized]
- Title: Senior Firearms Instructor
- Certifications: PSIRA, QCTO Certified
- Experience: 15+ years

---

## 🔗 Usage in Code

### Logo in Header
```svelte
<img src="/images/logos/prosiya-logo.png" alt="ProSiya Academy" class="logo" />
```

### Accreditation Badges
```svelte
<div class="badges">
  <img src="/images/badges/psira.png" alt="PSIRA Accredited" />
  <img src="/images/badges/qcto.png" alt="QCTO Quality Assured" />
  <img src="/images/badges/sasseta.png" alt="SASSETA Accredited" />
</div>
```

### Course Cards
```svelte
<div class="course-card">
  <img src="/images/courses/security-training.png" alt="Security Training" />
  <h3>Security Training</h3>
  <ul class="feature-list">
    <li>Security Grades E - A</li>
    <li>Firearm Competency</li>
    <li>Armed Response & CIT</li>
  </ul>
  <button class="btn btn-accent">View Course</button>
</div>
```

### Instructor Profile
```svelte
<div class="instructor">
  <img src="/images/instructors/instructor-1.png" alt="Instructor Name" />
  <h4>Instructor Name</h4>
  <p>Senior Firearms Instructor</p>
</div>
```

---

## 📊 Asset Specifications

| Asset Type | Format | Recommended Size | Actual Size |
|------------|--------|------------------|-------------|
| Logo | PNG | 400×400px | Square |
| Badges | PNG | 200×200px | Square |
| Course Images | PNG | 1200×675px | 16:9 |
| Instructor Photos | PNG | 400×400px | Square |

---

## 🎨 Design Consistency

All generated assets follow these design principles:

✅ **Color Scheme**: Navy blue (#1a2332) and gold (#FDB913)  
✅ **Professional**: Corporate, trustworthy aesthetic  
✅ **High Quality**: Sharp, well-lit, professional photography style  
✅ **Diverse**: Inclusive representation  
✅ **Safety-Focused**: Emphasis on proper technique and safety equipment  
✅ **Brand Consistent**: Matches mockup design and color palette  

---

## 🔄 Replacement Instructions

If you want to replace any generated asset with your own:

1. **Prepare your image**:
   - Match the recommended size
   - Use PNG format for transparency (logos, badges)
   - Use JPG or WebP for photos (courses, instructors)

2. **Replace the file**:
   ```bash
   # Navigate to frontend directory
   cd frontend/static/images/[category]
   
   # Replace the file (keep the same filename)
   # Example: Replace logo
   copy your-logo.png logos/prosiya-logo.png
   ```

3. **Refresh the browser** - Changes will appear immediately

---

## ✅ Next Steps

### Immediate
- [x] Generate all core assets
- [x] Copy to static directory
- [ ] Update homepage to use assets
- [ ] Create course cards with images
- [ ] Add accreditation badges section

### Future Assets Needed
- [ ] Additional instructor photos (when you have real instructors)
- [ ] More course images (for additional courses)
- [ ] Hero/banner images for landing page
- [ ] Certificate template background
- [ ] Email template assets
- [ ] Social media graphics

---

## 📝 Notes

- All assets are AI-generated and can be used freely
- Replace with official logos/photos when available
- Maintain consistent sizing and aspect ratios
- Optimize images for web (compress if needed)
- Consider WebP format for better performance

---

**Status**: ✅ Complete  
**Ready for**: Homepage integration  
**Estimated Time**: 10 minutes (completed)
