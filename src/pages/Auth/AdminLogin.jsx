import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/animated-bg.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden px-4">
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 bg-animated-gradient -z-10"></div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#fdfcfb]/80 backdrop-blur-2xl border border-[#f0e9e1]/60 shadow-2xl p-8 sm:p-10 rounded-3xl w-full max-w-md"
      >
        {/* 🏪 Logo / Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/galura.png"
            alt="My Store Logo"
            className="w-80 h-40 object-cover rounded-2xl shadow-md border-4 border-[#f8f5f0] mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tracking-tight text-center">
            My Store Admin
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Login to manage your store
          </p>
        </div>

        {/* ⚠️ Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3 text-center border border-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* 📧 Email */}
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full p-3 mb-4 rounded-xl bg-[#fdfcfb] border-none text-gray-800 shadow-inner
          focus:outline-none focus:ring-2 focus:ring-[#72bdfd] focus:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* 🔒 Password */}
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full p-3 mb-2 rounded-xl bg-[#fdfcfb] border-none text-gray-800 shadow-inner
          focus:outline-none focus:ring-2 focus:ring-[#72bdfd] focus:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ✅ Remember Me */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center space-x-2 text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-[#72bdfd] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-[#1e3a8a] hover:underline hover:text-[#56a8ff]"
          >
            Forgot password?
          </button>
        </div>

        {/* 🔘 Login Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            loading
              ? "text-gray-300 bg-[#dbe9ff] cursor-not-allowed"
              : "text-[#1e3a8a] bg-[#fdfcfb] hover:bg-[#f0f7ff]"
          } shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]`}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* 👣 Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 My Store. All rights reserved.
        </p>
      </motion.form>
    </div>
  );
}
