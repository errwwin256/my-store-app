import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";

// ✅ Export the auth instance
export const auth = getAuth(app);
