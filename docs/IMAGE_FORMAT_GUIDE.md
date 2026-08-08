# Image Configuration for ProSiya LMS

## Current Image References

All images are currently referenced with `.png` extension in the code.

## Using JPG Files - Two Options:

### Option 1: Rename Your JPG Files (EASIEST - NO CODE CHANGES)

Simply rename your JPG files to have `.png` extension when copying them:

```bash
# Example:
Your file: prosiya-logo.jpg
Copy as:   prosiya-logo.png

Your file: instructor-photo.jpg  
Copy as:   instructor-1.png
```

**Why this works:**
- Browsers display images based on actual file content, not extension
- A JPG file named `.png` will display perfectly fine
- No code changes needed!

### Option 2: Update Code to Use JPG Extensions

If you prefer to keep `.jpg` extensions, here are the files to update:

#### Files with Image References:

1. **frontend/src/lib/components/Header.svelte**
   - Line 15: `/images/logos/prosiya-logo.png` → `.jpg`

2. **frontend/src/lib/components/Footer.svelte**
   - Lines 11-13: Badge images `.png` → `.jpg`

3. **frontend/src/lib/components/Sidebar.svelte**
   - Line 6: Default avatar `.png` → `.jpg`

4. **frontend/src/routes/+page.svelte** (Landing page)
   - Lines 64-66: Badge images
   - Line 84: Instructor image
   - Line 28: Default course image

5. **frontend/src/routes/login/+page.svelte**
   - Line 42: Logo
   - Lines 47-49: Badges

6. **frontend/src/routes/register/+page.svelte**
   - Line 66: Logo

7. **frontend/src/routes/courses/[slug]/+page.svelte**
   - Lines 44-46: Badges
   - Line 104: Default course image

8. **All dashboard pages**
   - Default instructor avatar references

## Recommended Approach

**Use Option 1** - Just rename your JPG files to PNG when copying them. This is:
- ✅ Faster (no code changes)
- ✅ Safer (no risk of breaking references)
- ✅ Works perfectly (browsers don't care about extension)

## Image Locations

```
frontend/static/images/
├── badges/
│   ├── psira.png (can be JPG renamed to .png)
│   ├── qcto.png (can be JPG renamed to .png)
│   └── sasseta.png (can be JPG renamed to .png)
├── courses/
│   ├── security-training.png (can be JPG renamed to .png)
│   ├── firearm-training.png (can be JPG renamed to .png)
│   └── armed-response.png (can be JPG renamed to .png)
├── instructors/
│   └── instructor-1.png (can be JPG renamed to .png)
└── logos/
    └── prosiya-logo.png (can be JPG renamed to .png)
```

## Quick Steps to Replace Images

1. **Prepare your JPG images**
2. **Navigate to** `C:\Users\Admin\Desktop\Pro Siya White-label Compliance Lms\frontend\static\images\`
3. **Copy your images** to the appropriate folders
4. **Rename them** to match the existing PNG names:
   - `your-logo.jpg` → `prosiya-logo.png`
   - `your-badge.jpg` → `psira.png`
   - etc.
5. **Refresh browser** (Ctrl+F5)
6. **Done!** ✅

## Example

```bash
# You have:
my-company-logo.jpg
psira-certification.jpg
instructor-john.jpg

# Copy and rename to:
prosiya-logo.png
psira.png
instructor-1.png

# Place in:
frontend/static/images/logos/prosiya-logo.png
frontend/static/images/badges/psira.png
frontend/static/images/instructors/instructor-1.png
```

## Technical Note

**Why renaming works:**
- Image format is determined by file content (magic bytes), not extension
- Browsers read the actual image data
- A JPEG file with `.png` extension displays as JPEG
- No quality loss or conversion needed

**If you want proper extensions:**
- Let me know and I'll update all 30+ references in the code
- Or use a find-replace in your editor
- Replace `.png"` with `.jpg"` in all `.svelte` files
