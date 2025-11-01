import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  CreditCard,
  BarChart3,
  FileText,
} from "lucide-react";

const menu = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/products", label: "Products", icon: Package },
  { path: "/credit", label: "Utang List", icon: CreditCard },
  { path: "/sales", label: "Sales", icon: BarChart3 },
  { path: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen w-64 p-5 shadow-lg flex flex-col">
      <h2 className="text-2xl font-extrabold mb-8 tracking-wide text-center text-blue-400">
        Admin Panel
      </h2>

      <ul className="space-y-2 flex-1">
        {menu.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto text-center text-xs text-gray-500 border-t border-gray-700 pt-3">
        © 2025 My Store
      </div>
    </aside>
  );
}
