import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
// Ideally we should use service account, but for this context we might rely on default credentials or environment variables.
// If SERVICE_ACCOUNT_KEY is present, we use it. Otherwise we assume Google Cloud environment or local emulator if configured.
// For strictly hardening this, we really need the service account.
// Given the user flow, I will check for env vars structure.

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

if (!getApps().length) {
    if (serviceAccount) {
        if (process.env.NODE_ENV !== 'production') console.log("Initializing Firebase Admin with Service Account");
        initializeApp({
            credential: cert(serviceAccount)
        });
    } else {
        if (process.env.NODE_ENV !== 'production') console.log("Initializing Firebase Admin with Project ID");
        try {
            initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
        } catch (e) {
            console.error("Firebase Admin initialization failed:", e);
        }
    }
} else {
    if (process.env.NODE_ENV !== 'production') console.log("Firebase Admin already initialized");
}

export async function verifyAuth(request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Auth verification failed:", error);
        throw new Error(`Auth verification failed: ${error.message}`);
    }
}
