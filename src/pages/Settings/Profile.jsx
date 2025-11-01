import { useState, useEffect } from "react";
import { auth } from "../../firebase/auth";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return alert("No user logged in");

    try {
      setLoading(true);
      setMessage("");

      // Update display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update email
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Update password (optional)
      if (password.trim() !== "") {
        await updatePassword(user, password);
      }

      setMessage("✅ Profile updated successfully!");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Loading user info...</p>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto mt-12 bg-[#FFF9F0] p-8 rounded-2xl shadow-lg border border-[#E0E7FF]/40">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#2563eb]">
        ⚙️ Profile Settings
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleUpdate}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-[#A7C7E7] rounded-md focus:ring-2 focus:ring-[#89CFF0] outline-none"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-[#A7C7E7] rounded-md focus:ring-2 focus:ring-[#89CFF0] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-2 border border-[#A7C7E7] rounded-md focus:ring-2 focus:ring-[#89CFF0] outline-none"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6EC1E4] hover:bg-[#5AB3DC]"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div className="mt-6 text-sm text-center text-gray-600">
        <p>
          <span className="font-medium text-gray-800">User ID:</span>{" "}
          <span className="text-[#2563eb]">{user.uid}</span>
        </p>
        <p className="mt-1">
          <span className="font-medium">Last Login:</span>{" "}
          {user.metadata?.lastSignInTime}
        </p>
      </div>
    </div>
  );
}
