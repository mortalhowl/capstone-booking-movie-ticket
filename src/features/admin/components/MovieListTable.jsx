import { useState } from "react";
import dayjs from "dayjs";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Star,
  Flame,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function MovieListTable({
  movies = [],
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onCreateShowtime,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, DANG_CHIEU, SAP_CHIEU, HOT

  // Hàm định dạng hiển thị CHỈ NGÀY (DD/MM/YYYY), loại bỏ hoàn toàn giờ
  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "--/--/----";
    if (typeof dateStr === "string" && dateStr.includes("/")) {
      return dateStr.split(" ")[0]; // Cắt bỏ phần giờ đằng sau nếu có
    }
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format("DD/MM/YYYY") : String(dateStr).split(" ")[0];
  };

  // State Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Mặc định 5 phim / trang

  // Lọc danh sách phim theo từ khóa & bộ lọc
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.maPhim?.toString().includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterStatus === "HOT") return movie.hot;
    if (filterStatus === "DANG_CHIEU") return movie.dangChieu;
    if (filterStatus === "SAP_CHIEU") return movie.sapChieu;

    return true;
  });

  // Sắp xếp danh sách: Ưu tiên Phim đang chiếu & Phim mới thêm (mã phim lớn nhất) lên Trang 1
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    // 1. Phim đang chiếu được ưu tiên đứng trước
    if (a.dangChieu !== b.dangChieu) {
      return b.dangChieu ? 1 : -1;
    }
    // 2. Phim mới nhất (Mã phim lớn hơn) đứng trước
    return (b.maPhim || 0) - (a.maPhim || 0);
  });

  // Tính toán dữ liệu phân trang
  const totalItems = sortedMovies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Đảm bảo trang hiện tại không vượt quá tổng số trang sau khi lọc
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedMovies = sortedMovies.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Header Actions & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã phim hoặc tên phim..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
            }}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                setFilterStatus("ALL");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === "ALL"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => {
                setFilterStatus("DANG_CHIEU");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === "DANG_CHIEU"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Đang chiếu
            </button>
            <button
              onClick={() => {
                setFilterStatus("SAP_CHIEU");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === "SAP_CHIEU"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sắp chiếu
            </button>
            <button
              onClick={() => {
                setFilterStatus("HOT");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === "HOT"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🔥 Hot
            </button>
          </div>

          <button
            onClick={onAddMovie}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phim Mới</span>
          </button>
        </div>
      </div>

      {/* Movie Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
              <th className="py-4 px-4 text-center w-20">Mã Phim</th>
              <th className="py-4 px-4 w-28">Hình Ảnh</th>
              <th className="py-4 px-4 min-w-[200px]">Tên Phim</th>
              <th className="py-4 px-4 min-w-[140px]">Trạng Thái</th>
              <th className="py-4 px-4 w-32">Đánh Giá</th>
              <th className="py-4 px-4 w-36">Khởi Chiếu</th>
              <th className="py-4 px-4 text-center w-48">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 text-sm text-slate-300">
            {paginatedMovies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Film className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                    <p className="font-medium text-slate-400">Không tìm thấy phim phù hợp</p>
                    <p className="text-xs text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc của bạn</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedMovies.map((movie) => (
                <tr
                  key={movie.maPhim}
                  className="hover:bg-slate-900/60 transition-colors group"
                >
                  {/* Mã Phim */}
                  <td className="py-3 px-4 text-center font-semibold text-slate-400">
                    <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono text-blue-400">
                      #{movie.maPhim}
                    </span>
                  </td>

                  {/* Hình Ảnh Poster */}
                  <td className="py-3 px-4">
                    <div className="w-14 h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 relative group/img">
                      <img
                        src={movie.hinhAnh}
                        alt={movie.tenPhim}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x200?text=No+Poster";
                        }}
                      />
                    </div>
                  </td>

                  {/* Tên & Mô tả Phim */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {movie.tenPhim}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2 mt-1 max-w-sm font-normal leading-relaxed">
                      {movie.moTa || "Chưa có mô tả..."}
                    </div>
                  </td>

                  {/* Trạng Thái Badges */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {movie.hot && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          <span>Hot</span>
                        </span>
                      )}

                      {movie.dangChieu && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Đang chiếu
                        </span>
                      )}

                      {movie.sapChieu && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Sắp chiếu
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Đánh giá */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 font-semibold text-slate-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{movie.danhGia || 0}/10</span>
                    </div>
                  </td>

                  {/* Ngày khởi chiếu (chỉ hiển thị ngày, không có giờ) */}
                  <td className="py-3 px-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium text-slate-300">{formatDateOnly(movie.ngayKhoiChieu)}</span>
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onCreateShowtime(movie)}
                        title="Tạo lịch chiếu"
                        className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg border border-indigo-500/20 transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditMovie(movie)}
                        title="Sửa thông tin phim"
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg border border-blue-500/20 transition-all cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMovie(movie)}
                        title="Xóa phim"
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer & Phân Trang (Pagination) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span>
            Hiển thị <span className="font-semibold text-slate-200">{paginatedMovies.length}</span> / <span className="font-semibold text-slate-200">{totalItems}</span> phim
          </span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5 phim/trang</option>
              <option value={10}>10 phim/trang</option>
              <option value={15}>15 phim/trang</option>
            </select>
          </div>
        </div>

        {/* Thanh chuyển trang */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                  safeCurrentPage === pageNum
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
