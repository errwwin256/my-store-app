import { Edit3, Trash2, Package } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const lowStock = product.stock < 5;

  return (
    <div
      className={`p-5 rounded-2xl transition-all duration-300 shadow-[inset_3px_3px_6px_#e5e7eb,inset_-3px_-3px_6px_#ffffff] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] bg-white relative overflow-hidden ${
        lowStock ? "border border-red-300" : "border border-gray-100"
      }`}
    >
      {/* ⚠️ Low Stock Badge */}
      {lowStock && (
        <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
          Low Stock
        </span>
      )}

      {/* 🖼️ Image */}
      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 shadow-inner">
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* 🏷️ Product Info */}
      <h3 className="font-extrabold text-lg text-gray-800 truncate">
        {product.name}
      </h3>
      <p className="text-gray-500 text-sm flex items-center gap-1">
        <Package size={14} />
        {product.category || "Uncategorized"}
      </p>

      {/* 💰 Price + Stock */}
      <div className="mt-3 flex justify-between items-center">
        <p className="text-blue-600 font-bold text-lg">
          ₱{product.price?.toLocaleString()}
        </p>
        <p
          className={`text-sm font-medium ${
            lowStock ? "text-red-500" : "text-gray-500"
          }`}
        >
          Stock: {product.stock}
        </p>
      </div>

      {/* 🛠️ Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 w-full justify-center bg-yellow-400 text-white font-semibold py-2 rounded-lg hover:bg-yellow-500 transition shadow-md hover:shadow-lg"
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 w-full justify-center bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
