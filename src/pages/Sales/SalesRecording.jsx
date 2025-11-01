import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useSales } from "../../context/SalesContext";
import { serverTimestamp } from "firebase/firestore";

export default function SalesRecording() {
  const { products, updateProduct } = useProducts();
  const { recordSale } = useSales();

  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProduct = products.find((p) => p.id === selected);
  const total = selectedProduct ? selectedProduct.price * quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const product = products.find((p) => p.id === selected);
      if (!product) return alert("Please select a product");
      if (quantity <= 0 || quantity > product.stock)
        return alert("Invalid quantity");

      const total = product.price * quantity;

      await recordSale({
        productId: product.id,
        productName: product.name,
        quantity: Number(quantity),
        amount: total,
        customer: customer || "Walk-in",
        date: serverTimestamp(),
      });

      await updateProduct(product.id, {
        ...product,
        stock: product.stock - quantity,
      });

      alert("✅ Sale recorded successfully!");
      setSelected("");
      setQuantity("");
      setCustomer("");
    } catch (err) {
      console.error("Error recording sale:", err);
      alert("❌ Failed to record sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-[#fff9f5] p-6 rounded-xl shadow-md border border-[#f3e8e2]">
      <h2
        className="text-3xl font-extrabold mb-6 text-center 
  bg-gradient-to-r from-pink-400 via-fuchsia-400 to-sky-400 
  bg-clip-text text-transparent drop-shadow-[0_3px_8px_rgba(255,182,193,0.5)]"
      >
        Record Sale
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🧾 Product Selector */}
        <select
          className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5AB2FF]"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={p.stock <= 0}
              className={p.stock <= 0 ? "text-gray-400" : ""}
            >
              {p.name} (₱{p.price}) —{" "}
              {p.stock <= 0 ? "Out of stock" : `Stock: ${p.stock}`}
            </option>
          ))}
        </select>

        {/* 📦 Quantity */}
        <input
          type="number"
          min="1"
          max={selectedProduct?.stock || 1}
          placeholder="Quantity"
          className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5AB2FF]"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          disabled={!selectedProduct}
        />

        {/* 👤 Customer */}
        <input
          type="text"
          placeholder="Customer Name (optional)"
          className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#5AB2FF]"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        {/* 💸 Total Price */}
        {selectedProduct && quantity > 0 && (
          <div className="p-3 bg-[#e8f6ff] border rounded-md text-center text-gray-700">
            Total:{" "}
            <span className="font-semibold text-[#0077cc]">
              ₱{total.toLocaleString()}
            </span>
          </div>
        )}

        {/* ✅ Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold shadow-md transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#5AB2FF] hover:bg-[#4a9de6]"
          }`}
        >
          {loading ? "Recording..." : "Record Sale"}
        </button>
      </form>
    </div>
  );
}
