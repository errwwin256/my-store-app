import { Bell, LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] px-6 py-3 flex justify-between items-center rounded-b-2xl">
      {/* 🏪 Brand */}
      <h1 className="text-xl font-extrabold tracking-tight text-blue-600">
        My Store Dashboard
      </h1>

      {/* 🔔 Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button
          className="relative text-gray-600 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}
