# 📸 Image Upload & Management Guide

**Last Updated**: 2026-01-21  
**For**: ProSiya LMS

---

## 📁 Where to Upload Images

All static images are stored in the **`frontend/static/images/`** directory. This folder is automatically served by SvelteKit.

### Current Image Structure

```
frontend/static/images/
├── badges/              # Accreditation badges
│   ├── psira.png       # PSIRA logo
│   ├── qcto.png        # QCTO logo
│   └── sasseta.png     # SASSETA logo
├── courses/             # Course cover images
│   ├── security-training.png
│   ├── firearm-training.png
│   └── armed-response.png
├── instructors/         # Instructor photos
│   └── instructor-1.png
└── logos/               # Brand logos
    └── prosiya-logo.png
```

---

## 🖼️ How to Replace Images

### Step 1: Prepare Your Images

**Recommended Specifications:**

#### Logos
- **ProSiya Logo**: 300x100px, PNG with transparent background
- **File**: `frontend/static/images/logos/prosiya-logo.png`

#### Accreditation Badges
- **Size**: 200x200px (square)
- **Format**: PNG with transparent background
- **Files**:
  - `frontend/static/images/badges/psira.png`
  - `frontend/static/images/badges/qcto.png`
  - `frontend/static/images/badges/sasseta.png`

#### Course Cover Images
- **Size**: 800x500px (16:10 ratio)
- **Format**: JPG or PNG
- **Files**:
  - `frontend/static/images/courses/security-training.png`
  - `frontend/static/images/courses/firearm-training.png`
  - `frontend/static/images/courses/armed-response.png`

#### Instructor Photos
- **Size**: 400x400px (square)
- **Format**: JPG or PNG
- **Files**:
  - `frontend/static/images/instructors/instructor-1.png`
  - `frontend/static/images/instructors/instructor-2.png`
  - etc.

### Step 2: Replace Files

Simply copy your new images to the appropriate folder, **keeping the same filename**:

```bash
# Example: Replace ProSiya logo
# 1. Navigate to the images folder
cd "C:\Users\Admin\Desktop\Pro Siya White-label Compliance Lms\frontend\static\images\logos"

# 2. Replace the file (Windows)
# - Delete or rename the old prosiya-logo.png
# - Copy your new logo and name it prosiya-logo.png
```

**Important**: Keep the same filenames to avoid breaking references in the code!

---

## 🎨 Image Usage in Code

### How Images Are Referenced

Images in the `static/` folder are served from the root URL:

```svelte
<!-- In any .svelte file -->
<img src="/images/logos/prosiya-logo.png" alt="ProSiya Academy" />
<img src="/images/badges/psira.png" alt="PSIRA Accredited" />
<img src="/images/courses/security-training.png" alt="Security Training" />
```

### Where Images Are Used

#### 1. **Landing Page** (`frontend/src/routes/+page.svelte`)
- ProSiya logo (header)
- Accreditation badges (hero section)
- Course cover images (course cards)

#### 2. **Login/Register Pages**
- ProSiya logo
- Accreditation badges

#### 3. **Student Dashboard**
- Course cover images (enrolled courses)
- Instructor photos (if applicable)

#### 4. **Course Detail Page**
- Course cover image
- Accreditation badges
- Instructor photo

#### 5. **Header Component** (`frontend/src/lib/components/Header.svelte`)
- ProSiya logo

---

## 📤 Adding New Images

### For New Courses

1. **Add course cover image**:
   ```
   frontend/static/images/courses/your-course-name.png
   ```

2. **Reference in database**:
   - When creating a course in Django admin
   - Set `cover_image` field to: `/images/courses/your-course-name.png`

### For New Instructors

1. **Add instructor photo**:
   ```
   frontend/static/images/instructors/instructor-2.png
   ```

2. **Reference in user profile**:
   - Update user's `avatar` field to: `/images/instructors/instructor-2.png`

### For Additional Badges

1. **Add badge image**:
   ```
   frontend/static/images/badges/new-badge.png
   ```

2. **Update code** where badges are displayed (e.g., landing page)

---

## 🗄️ Backend Media Uploads

For **user-uploaded content** (evidence photos, documents, etc.), the backend uses Django's media handling:

### Configuration

In `backend/core/settings.py`:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# For production with S3
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
```

### Upload Locations

User-uploaded files go to:
```
backend/media/
├── course_covers/        # Course cover uploads
├── course_videos/        # Course intro videos
├── lesson_videos/        # Lesson videos
├── lesson_documents/     # Lesson PDFs
├── evidence_photos/      # Firearm evidence photos
├── evidence_videos/      # Firearm evidence videos
└── certificates/         # Generated certificate PDFs
```

### How to Access

Backend media files are served at:
- **Development**: `http://localhost:8000/media/filename.jpg`
- **Production**: `https://your-cdn.com/media/filename.jpg`

---

## 🎯 Quick Reference

### Static Images (Frontend)
| Type | Location | Size | Format |
|------|----------|------|--------|
| Logo | `static/images/logos/` | 300x100px | PNG |
| Badges | `static/images/badges/` | 200x200px | PNG |
| Courses | `static/images/courses/` | 800x500px | JPG/PNG |
| Instructors | `static/images/instructors/` | 400x400px | JPG/PNG |

### User Uploads (Backend)
| Type | Location | Handled By |
|------|----------|------------|
| Course Media | `backend/media/course_*` | Django |
| Evidence | `backend/media/evidence_*` | Django |
| Certificates | `backend/media/certificates/` | Django |

---

## 🔧 Optimization Tips

### 1. Compress Images
Use tools like:
- **TinyPNG** (https://tinypng.com/)
- **ImageOptim** (Mac)
- **Squoosh** (https://squoosh.app/)

### 2. Use WebP Format
For better compression:
```bash
# Convert PNG to WebP
cwebp input.png -o output.webp
```

### 3. Lazy Loading
Images are automatically lazy-loaded in modern browsers:
```svelte
<img src="/images/course.png" loading="lazy" alt="Course" />
```

---

## 🚀 Production Setup

### For S3/CloudFront (Recommended)

1. **Upload static images to S3**:
   ```bash
   aws s3 sync frontend/static/images/ s3://your-bucket/images/
   ```

2. **Update image URLs** in code:
   ```svelte
   <img src="https://cdn.prosiya.com/images/logos/prosiya-logo.png" />
   ```

3. **Configure CDN** for faster delivery

---

## 📝 Checklist for Image Replacement

- [ ] Prepare images in correct sizes
- [ ] Optimize/compress images
- [ ] Navigate to `frontend/static/images/`
- [ ] Replace files keeping same names
- [ ] Test in browser (Ctrl+F5 to clear cache)
- [ ] Verify all pages display correctly
- [ ] Check responsive behavior
- [ ] Commit changes to git

---

## 🆘 Troubleshooting

### Image Not Showing?

1. **Check file path**:
   - Must be in `frontend/static/images/`
   - Path in code: `/images/filename.png` (no `static/`)

2. **Clear browser cache**:
   - Press `Ctrl + F5` (Windows)
   - Press `Cmd + Shift + R` (Mac)

3. **Check file permissions**:
   - Ensure files are readable

4. **Verify filename**:
   - Check spelling and case sensitivity
   - No spaces in filenames (use hyphens)

### Image Quality Issues?

1. **Check original resolution**
2. **Use PNG for logos/badges** (transparency)
3. **Use JPG for photos** (smaller file size)
4. **Compress without losing quality**

---

## 📞 Need Help?

If you need to:
- Add new image categories
- Change image paths in code
- Set up S3 storage
- Configure CDN

Let me know and I'll help you implement it!

---

**Quick Start**: Just drag and drop your images into `frontend/static/images/` folders, keeping the same filenames! 🎨
