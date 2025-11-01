import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Search products..."}
        className="w-full bg-white/80 backdrop-blur-md border border-gray-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-gray-700 placeholder-gray-400 shadow-sm focus:shadow-md transition-all duration-200 outline-none"
      />
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}
