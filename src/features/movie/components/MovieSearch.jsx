import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovieSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/movie?search=${encodeURIComponent(keyword.trim())}`);
  };
  return (
    <form onSubmit={handleSubmit} className="relative max-w-md w-full">
      <input
        onChange={(e) => setKeyword(e.target.value)}
        type="text"
        placeholder="Bạn muốn xem phim gì hôm nay?"
        className="w-full py-3 pl-4 pr-12 text-sm bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 rounded-xl shadow-lg focus:outline-none focus:bg-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 transition-all duration-300"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer"
      >
        <div className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-md">
          <Search className="w-4 h-4" />
        </div>
      </button>
    </form>
  );
}
