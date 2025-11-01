import React, { useState, useMemo } from "react";
import { useSales } from "../../context/SalesContext";

export default function ReportsPage() {
  const { sales, loading } = useSales();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const d =
      typeof date.toDate === "function"
        ? date.toDate()
        : date.seconds
        ? new Date(date.seconds * 1000)
        : new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSales = useMemo(() => {
    const list = sales.filter((s) =>
      s.productName?.toLowerCase().includes(search.toLowerCase())
    );
    return list.sort((a, b) => {
      const valA = a[sortField] || 0;
      const valB = b[sortField] || 0;
      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }, [sales, search, sortField, sortOrder]);

  const totalRevenue = useMemo(
    () =>
      filteredSales.reduce(
        (sum, s) => sum + (Number(s.amount || s.total) || 0),
        0
      ),
    [filteredSales]
  );

  const avgSale =
    filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const mostSold =
    filteredSales.length > 0
      ? [...filteredSales].sort((a, b) => b.quantity - a.quantity)[0]
      : null;

  if (loading)
    return (
      <div className="p-6 text-center text-bubble animate-pulse">
        Loading reports...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#FFF9F0] min-h-screen">
      <h2
        className="text-3xl font-extrabold mb-6 text-center 
  bg-gradient-to-r from-pink-400 via-rose-400 to-sky-400 
  bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(255,182,193,0.5)]"
      >
        Sales Reports
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#89CFF0] text-white p-4 rounded-xl shadow-lg">
          <h3>Total Sales</h3>
          <p className="text-2xl font-bold">{filteredSales.length}</p>
        </div>
        <div className="bg-[#6EC1E4] text-white p-4 rounded-xl shadow-lg">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#FFD6A5] text-gray-800 p-4 rounded-xl shadow-lg">
          <h3>Average Sale</h3>
          <p className="text-2xl font-bold">
            ₱
            {avgSale.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-[#A7C7E7] text-gray-800 p-4 rounded-xl shadow-lg">
          <h3>Top Product</h3>
          <p className="text-lg font-bold">{mostSold?.productName || "—"}</p>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by product..."
        className="w-full p-3 mb-5 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#89CFF0]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#E0F7FF] border-b text-gray-700">
              {[
                { key: "productName", label: "Product" },
                { key: "quantity", label: "Quantity" },
                { key: "customer", label: "Customer" },
                { key: "amount", label: "Total (₱)" },
                { key: "date", label: "Date" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="p-3 text-left cursor-pointer hover:text-[#2563eb] select-none"
                >
                  {col.label}{" "}
                  {sortField === col.key && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-[#FFF1E6] even:bg-[#FAFAFA]"
                >
                  <td className="p-3">{s.productName}</td>
                  <td className="p-3">{s.quantity}</td>
                  <td className="p-3">{s.customer}</td>
                  <td className="p-3">
                    ₱{(s.amount || s.total || 0).toLocaleString()}
                  </td>
                  <td className="p-3">{formatDate(s.date || s.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-8 text-lg"
                >
                  🔍 No sales found for “{search}”
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary */}
      <div className="text-right mt-6">
        <p className="text-xl font-bold text-gray-700">
          🧾 Total Revenue:{" "}
          <span className="text-[#2563eb]">
            ₱{totalRevenue.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}
