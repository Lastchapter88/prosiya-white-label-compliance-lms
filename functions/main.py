# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

app = initialize_app()
db = firestore.client()

@https_fn.on_request()
def add_user(req: https_fn.Request) -> https_fn.Response:
    """HTTP Cloud Function to add a user (Example)."""
    # Grab the text parameter.
    original = req.args.get("text")
    if original is None:
        return https_fn.Response("No text provided", status=400)

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    write_result = db.collection("users").add({"original": original})

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Users with ID: {write_result[1].id} added.")

@firestore_fn.on_document_created(document="users/{userId}")
def on_user_created(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    """Trigger: When a user document is created, initialize their profile."""
    
    # Get the data from the document
    user_data = event.data.to_dict()
    user_id = event.params["userId"]
    
    print(f"New user created: {user_id}")
    
    # Example: Set default role if not present
    if "role" not in user_data:
        db.collection("users").document(user_id).update({"role": "student"})

@https_fn.on_request()
def enroll_student(req: https_fn.Request) -> https_fn.Response:
    """
    HTTP Function: Enrolls a student in a course.
    Verifies prerequisites and updates enrollment count.
    """
    # 1. Parse request body
    # 2. Verify Auth (req.auth)
    # 3. Check prerequisites in Firestore
    # 4. Create enrollment document
    # 5. Increment course enrollment count
    return https_fn.Response("Enrollment logic placeholder")
