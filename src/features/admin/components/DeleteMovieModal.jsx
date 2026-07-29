import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteMovieModal({ isOpen, onClose, movie, onConfirmDelete }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">Xác Nhận Xóa Phim</h3>
            <p className="text-xs text-slate-400 mt-1">
              Hành động này sẽ xóa dữ liệu phim khỏi hệ thống và không thể hoàn tác.
            </p>
          </div>

          {/* Movie Card Preview */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 text-left">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-12 h-16 object-cover rounded-lg border border-slate-800"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x200?text=No+Poster";
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-mono text-blue-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                #{movie.maPhim}
              </span>
              <p className="font-bold text-sm text-slate-200 truncate mt-1">{movie.tenPhim}</p>
              <p className="text-xs text-slate-500 truncate">{movie.ngayKhoiChieu || "Chưa chọn ngày"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium text-sm transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                onConfirmDelete(movie.maPhim);
                onClose();
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm py-2.5 rounded-xl shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa Phim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
