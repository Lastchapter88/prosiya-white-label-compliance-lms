import firebase_admin
from firebase_admin import credentials, firestore
import json
import sys
from pathlib import Path

# Setup Firebase Admin SDK
# YOU MUST DOWNLOAD YOUR SERVICE ACCOUNT KEY FROM FIREBASE CONSOLE
cred_path = Path("serviceAccountKey.json")
if not cred_path.exists():
    print("Error: serviceAccountKey.json not found. Please download it from Firebase Console -> Project Settings -> Service Accounts.")
    sys.exit(1)

cred = credentials.Certificate(str(cred_path))
firebase_admin.initialize_app(cred)
db = firestore.client()

def import_data():
    input_file = Path("firebase_export.json")
    if not input_file.exists():
        print("Error: firebase_export.json not found. Run export_to_json.py first.")
        sys.exit(1)

    with open(input_file, 'r') as f:
        data = json.load(f)

    batch = db.batch()
    count = 0
    BATCH_LIMIT = 400  # Firestore batch limit is 500 operations

    # 1. Tenants
    print("Importing Tenants...")
    for tenant in data.get("tenants", []):
        doc_ref = db.collection("tenants").document(tenant["id"])
        batch.set(doc_ref, tenant)
        count += 1

    # 2. Users
    print("Importing Users...")
    for user in data.get("users", []):
        doc_ref = db.collection("users").document(user["uid"])
        batch.set(doc_ref, user)
        count += 1
        
        if count >= BATCH_LIMIT:
            batch.commit()
            batch = db.batch()
            count = 0
            print("Committed batch.")

    # 3. Courses (Logic to handle nested subcollections)
    print("Importing Courses...")
    # Commit pending batch first to avoid mixing logic
    if count > 0:
        batch.commit()
        batch = db.batch()
        count = 0

    for course in data.get("courses", []):
        # Extract modules to save separately (as subcollections)
        modules = course.pop("modules", [])
        
        # Save Course document
        course_ref = db.collection("courses").document(course["id"])
        course_ref.set(course)  # Single write
        print(f"Saved Course: {course['title']}")

        # Save Modules & Lessons
        for module in modules:
            lessons = module.pop("lessons", [])
            module_ref = course_ref.collection("modules").document(module["id"])
            module_ref.set(module)
            
            for lesson in lessons:
                lesson_ref = module_ref.collection("lessons").document(lesson["id"])
                lesson_ref.set(lesson)

    # 4. Enrollments
    print("Importing Enrollments...")
    batch = db.batch()
    for enrollment in data.get("enrollments", []):
        doc_ref = db.collection("enrollments").document(enrollment["id"])
        batch.set(doc_ref, enrollment)
        count += 1
        
        if count >= BATCH_LIMIT:
            batch.commit()
            batch = db.batch()
            count = 0

    # Final commit
    if count > 0:
        batch.commit()
        print("Committed final batch.")

    print("Import Complete!")

if __name__ == '__main__':
    import_data()
