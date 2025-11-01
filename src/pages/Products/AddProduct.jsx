import { useState } from "react";
import { useProducts } from "../../context/ProductContext";

export default function AddProduct() {
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price)
      return alert("Please fill all fields");

    await addProduct({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      createdAt: new Date(),
    });

    alert("✅ Product added successfully!");
    setFormData({ name: "", category: "", price: "", stock: "" });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        ➕ Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="w-full p-2 border rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full p-2 border rounded-md"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₱)"
          className="w-full p-2 border rounded-md"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          className="w-full p-2 border rounded-md"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
