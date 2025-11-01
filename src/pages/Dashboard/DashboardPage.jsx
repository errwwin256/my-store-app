import React from "react";
import { useProducts } from "../../context/ProductContext";
import { useSales } from "../../context/SalesContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { products } = useProducts();
  const { sales } = useSales();

  const totalProducts = products?.length || 0;
  const totalSales = sales?.length || 0;

  // 💰 Total revenue
  const totalRevenue =
    sales?.reduce(
      (sum, sale) => sum + (Number(sale.amount || sale.total) || 0),
      0
    ) || 0;

  // 📅 Sort sales
  const recentSales = [...(sales || [])].sort(
    (a, b) =>
      new Date(b.date?.seconds * 1000 || b.date) -
      new Date(a.date?.seconds * 1000 || a.date)
  );

  // 📆 Date formatting
  const formatDate = (date) => {
    if (!date) return "—";
    if (typeof date === "object" && date.seconds)
      return new Date(date.seconds * 1000).toLocaleString();
    if (typeof date.toDate === "function")
      return date.toDate().toLocaleString();
    return new Date(date).toLocaleString();
  };

  const timeAgo = (date) => {
    const now = new Date();
    const d = new Date(date?.seconds ? date.seconds * 1000 : date);
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  // 🏆 Top-selling products
  const productSales = {};
  sales?.forEach((s) => {
    const name = s.productName || "Unknown";
    productSales[name] = (productSales[name] || 0) + (s.quantity || 0);
  });
  const topProducts = Object.entries(productSales)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // 📊 Sales chart data
  const salesByDate = {};
  sales?.forEach((s) => {
    const d = new Date(s.date?.seconds * 1000 || s.date);
    const day = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const total = Number(s.amount || s.total) || 0;
    salesByDate[day] = (salesByDate[day] || 0) + total;
  });

  const chartData = Object.entries(salesByDate).map(([day, total]) => ({
    day,
    total,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefcf9] to-[#b3e5fc] p-6">
      <h1
        className="text-3xl font-extrabold mb-6 
  bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400 
  bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(255,192,203,0.5)]"
      >
        Dashboard
      </h1>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Products",
            value: totalProducts,
            color: "from-blue-400 to-blue-500",
            icon: "📦",
          },
          {
            label: "Total Sales",
            value: totalSales,
            color: "from-green-400 to-green-500",
            icon: "🛒",
          },
          {
            label: "Total Revenue",
            value: `₱${totalRevenue.toLocaleString()}`,
            color: "from-pink-400 to-pink-500",
            icon: "💰",
          },
          {
            label: "Low Stock Alerts",
            value: products.filter((p) => p.stock < 5).length,
            color: "from-red-400 to-red-500",
            icon: "⚠️",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 text-white rounded-2xl shadow-md bg-gradient-to-r ${stat.color} hover:scale-[1.03] transition-transform`}
          >
            <h2 className="text-lg flex items-center gap-2">
              <span>{stat.icon}</span> {stat.label}
            </h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 📈 Sales Trend */}
      <div className="mt-10 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1a1a1a]">
          📈 Sales Trend
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">🕐</p>
            <p>No sales data to display yet.</p>
          </div>
        )}
      </div>

      {/* 🧾 Recent Sales */}
      <div className="mt-10 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1a1a1a]">
          🧾 Recent Sales
        </h2>

        {sales?.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-[#e3f2fd] text-[#0d1b2a]">
                <th className="p-3">Product</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">When</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.slice(0, 5).map((sale, index) => (
                <tr key={index} className="border-b hover:bg-[#f1f8ff]">
                  <td className="p-3">{sale.productName || "—"}</td>
                  <td className="p-3">{sale.quantity || 0}</td>
                  <td className="p-3">
                    ₱{(Number(sale.amount || sale.total) || 0).toLocaleString()}
                  </td>
                  <td className="p-3">{formatDate(sale.date)}</td>
                  <td className="p-3 text-gray-500">{timeAgo(sale.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">🕐</p>
            <p>No recent sales recorded yet.</p>
          </div>
        )}
      </div>

      {/* 🏆 Top Selling */}
      <div className="mt-10 bg-white/90 backdrop-blur-sm shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1a1a1a]">
          🏆 Top Selling Products
        </h2>

        {topProducts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {topProducts.map((item, i) => (
              <li key={i} className="flex justify-between py-3 text-[#333]">
                <span className="font-medium">
                  {i + 1}. {item.name}
                </span>
                <span>{item.qty} sold</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">📦</p>
            <p>No products sold yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
