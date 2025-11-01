import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgqMg2_m1-vMAvjnNzneUTCGzrpCoP4jI",
  authDomain: "my-store-app-12a1b.firebaseapp.com",
  projectId: "my-store-app-12a1b",
  storageBucket: "my-store-app-12a1b.firebasestorage.app",
  messagingSenderId: "62255146305",
  appId: "1:62255146305:web:71fa7a9a5c800d9896adc0",
  measurementId: "G-G5CKH0CWJD",
};

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Ensure user is always signed in (anonymous or logged in)
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    try {
      await signInAnonymously(auth);
      console.log("✅ Signed in anonymously");
    } catch (error) {
      console.error("❌ Anonymous sign-in error:", error);
    }
  } else {
    console.log("👤 Authenticated user:", user.uid);
  }
});
