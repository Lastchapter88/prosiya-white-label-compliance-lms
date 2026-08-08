# Firebase Migration Status

## Completed
- [x] Defined Firebase Architecture (Auth, Firestore, Functions, Storage).
- [x] Created `firebase.json` configuration.
- [x] Created `firestore.rules` with strict security policies.
- [x] Created `storage.rules` for media security.
- [x] Initialized `functions/` directory with `main.py` skeleton.
- [x] Created `backend/migrations_scripts/export_to_json.py` to extract Django data.
- [x] Created `backend/migrations_scripts/import_to_firestore.py` to load data into Firestore.

## Next Steps for User
1.  **Set up Firebase Project**: Go to [console.firebase.google.com](https://console.firebase.google.com), create a project.
2.  **Enable Services**: Enable Auth, Firestore, Functions, and Storage in the console.
3.  **Get Credentials**:
    *   Download `serviceAccountKey.json` from *Project Settings > Service Accounts*.
    *   Place it in `backend/migrations_scripts/`.
4.  **Run Migration**:
    ```bash
    cd backend
    # Install dependencies if needed (e.g. firebase-admin)
    pip install firebase-admin
    
    # Export data
    python migrations_scripts/export_to_json.py
    
    # Import to Firestore
    cd migrations_scripts
    python import_to_firestore.py
    ```
5.  **Deploy**:
    ```bash
    # Install Firebase CLI if not installed
    npm install -g firebase-tools
    
    firebase login
    firebase deploy
    ```
