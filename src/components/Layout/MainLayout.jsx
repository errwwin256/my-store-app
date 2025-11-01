import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export default function MainLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
    { name: "Credits", path: "/credits" },
    { name: "Profile", path: "/settings/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#B7E5CD] via-[#F2F7A1] via-[#FEAE6F]/40 to-[#7CF5FF] text-gray-800 transition-all">
      {/* 🌈 Navbar */}
      <header className="sticky top-0 z-40 bg-[#B7E5CD]/90 backdrop-blur-xl border-b border-[#7CF5FF]/50 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight 
  bg-gradient-to-r from-pink-400 via-rose-400 to-blue-400 
  bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(255,182,193,0.4)]"
          >
            My Store
          </h1>

          {/* 📱 Mobile Toggle */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-[#7CF5FF]/30 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* 🧭 Desktop Navigation */}
          <nav className="hidden sm:flex gap-6 items-center font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[#4A3F35] hover:text-[#7CF5FF] transition group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FEAE6F] transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-[#FEAE6F] text-white px-4 py-1.5 rounded-lg hover:bg-[#f59c57] transition flex items-center gap-2 font-semibold shadow-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>

        {/* 📱 Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-[#F2F7A1]/95 backdrop-blur-md border-t border-[#B7E5CD]/50 rounded-b-2xl shadow-md p-4 space-y-3 text-[#4A3F35] animate-fadeIn font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#B7E5CD]/60 transition"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#7CF5FF] text-[#4A3F35] py-2 rounded-lg hover:bg-[#7CF5FF]/70 transition font-semibold"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* ⚠️ Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#F2F7A1] rounded-2xl p-8 shadow-2xl text-center max-w-sm w-[90%] border border-[#B7E5CD]/60">
            <h2 className="text-lg font-bold text-[#4A3F35] mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-[#FEAE6F] text-white px-4 py-2 rounded-lg hover:bg-[#f59c57] transition font-semibold shadow-sm"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#7CF5FF]/50 text-[#4A3F35] px-4 py-2 rounded-lg hover:bg-[#7CF5FF]/70 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧾 Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-[#B7E5CD]/60 p-6 sm:p-10">
          {children}
        </div>
      </main>

      {/* 🦶 Footer */}
      <footer className="text-center py-4 text-sm text-[#4A3F35] border-t border-[#FEAE6F]/60 bg-[#7CF5FF]/60 backdrop-blur-lg">
        © 2025 My Store. All rights reserved.
      </footer>
    </div>
  );
}
