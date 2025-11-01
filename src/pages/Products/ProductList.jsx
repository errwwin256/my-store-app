import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useState, useMemo } from "react";

export default function ProductList() {
  const { products, deleteProduct, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleting, setDeleting] = useState(false);

  // 🧩 Get unique categories
  const categories = useMemo(() => {
    const cats = ["All"];
    products.forEach((p) => {
      if (p.category && !cats.includes(p.category)) cats.push(p.category);
    });
    return cats;
  }, [products]);

  // 🔍 Search + Filter
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || p.category === category || !p.category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 🗑️ Delete handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeleting(true);
      await deleteProduct(id);
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Loading products...</p>
        <div className="animate-pulse mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 bg-blue-100/50 rounded w-1/2 mx-auto" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#fff9f5] min-h-screen rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2
          className="text-3xl font-extrabold flex items-center gap-2 
  bg-gradient-to-r from-pink-400 via-rose-400 to-sky-400 
  bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(255,182,193,0.5)]"
        >
          Product List
        </h2>
        <Link
          to="/add-product"
          className="bg-[#5AB2FF] text-white px-4 py-2 rounded-md hover:bg-[#489EE8] transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search product..."
          className="w-full sm:w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AB2FF] bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="w-full sm:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5AB2FF] bg-white"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500 animate-fadeIn">
          <p className="text-4xl mb-2">🔎</p>
          <p>No products found.</p>
          {(search || category !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-3 text-[#5AB2FF] hover:underline text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md animate-fadeIn border border-[#f2e8df]">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-[#e8f6ff] border-b text-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-[#f9fcff] transition duration-150"
                >
                  <td className="p-3 font-medium text-gray-800">{p.name}</td>
                  <td className="p-3 text-gray-600">{p.category || "—"}</td>
                  <td className="p-3 font-semibold text-[#0077cc]">
                    ₱{Number(p.price).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.stock <= 0
                          ? "bg-red-100 text-red-600"
                          : p.stock <= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.stock <= 0 ? "Out of stock" : `${p.stock} pcs`}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <Link
                      to={`/edit-product/${p.id}`}
                      className="bg-[#FFD6A5] text-gray-800 px-3 py-1 rounded-md hover:bg-[#FFBF69] transition"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={deleting}
                      onClick={() => handleDelete(p.id, p.name)}
                      className={`px-3 py-1 rounded-md text-white transition ${
                        deleting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#FF6B6B] hover:bg-[#e55c5c]"
                      }`}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 text-sm text-gray-700">
            <div>
              Showing{" "}
              <span className="font-semibold text-[#0077cc]">
                {paginated.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}-
                {(page - 1) * rowsPerPage + paginated.length}
              </span>{" "}
              of {filtered.length} products
            </div>

            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-[#e8f6ff]"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-[#e8f6ff]"
              >
                Next
              </button>

              <select
                className="ml-3 border rounded-md p-1 text-sm bg-white focus:ring-2 focus:ring-[#5AB2FF]"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
