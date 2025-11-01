import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { products, updateProduct } = useProducts();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) setFormData(product);
  }, [id, products]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct(id, {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
    alert("✅ Product updated!");
    navigate("/products");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        ✏️ Edit Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          className="w-full p-2 border rounded-md"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          className="w-full p-2 border rounded-md"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          className="w-full p-2 border rounded-md"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
