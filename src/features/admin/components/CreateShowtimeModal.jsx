import { useState } from "react";
import { X, Calendar, Clock, DollarSign, Building2, Ticket, Check } from "lucide-react";
import dayjs from "dayjs";

export default function CreateShowtimeModal({ isOpen, onClose, movie, onSubmitSuccess }) {
  const minDateTimeStr = dayjs().format("YYYY-MM-DDTHH:mm");

  const [formData, setFormData] = useState({
    maHeThongRap: "CGV",
    maCumRap: "cgv-su-van-hanh",
    ngayChieuGioChieu: minDateTimeStr,
    giaVe: 90000,
  });

  if (!isOpen || !movie) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Khóa không cho chọn ngày giờ quá khứ
    if (name === "ngayChieuGioChieu" && value) {
      if (dayjs(value).isBefore(dayjs())) {
        finalValue = dayjs().format("YYYY-MM-DDTHH:mm");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitSuccess) {
      onSubmitSuccess({ ...formData, maPhim: movie.maPhim });
    }
    onClose();
  };

  const cinemaSystems = [
    { id: "CGV", name: "CGV Cinema", logo: "https://movienew.cybersoft.edu.vn/hauing/cgv.png" },
    { id: "BHDStar", name: "BHD Star Cineplex", logo: "https://movienew.cybersoft.edu.vn/hauing/bhd.png" },
    { id: "Galaxy", name: "Galaxy Cinema", logo: "https://movienew.cybersoft.edu.vn/hauing/galaxy.png" },
    { id: "Lotte", name: "Lotte Cinema", logo: "https://movienew.cybersoft.edu.vn/hauing/lotte.png" },
    { id: "MegaGS", name: "Mega GS", logo: "https://movienew.cybersoft.edu.vn/hauing/megags.png" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Tạo Lịch Chiếu Phim</h2>
              <p className="text-xs text-slate-400">Thiết lập thời gian & rạp chiếu cho bộ phim</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Movie Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-12 h-16 object-cover rounded-lg border border-slate-800"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x200?text=No+Poster";
              }}
            />
            <div>
              <span className="text-[11px] font-mono text-blue-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                Mã Phim: #{movie.maPhim}
              </span>
              <h4 className="font-bold text-sm text-slate-100 mt-1">{movie.tenPhim}</h4>
              <p className="text-xs text-slate-400">Tạo suất chiếu mới cho khán giả đặt vé</p>
            </div>
          </div>

          {/* Chọn Hệ thống rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hệ Thống Rạp</span>
            </label>
            <select
              name="maHeThongRap"
              value={formData.maHeThongRap}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {cinemaSystems.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Cụm Rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Cụm Rạp Chiếu
            </label>
            <select
              name="maCumRap"
              value={formData.maCumRap}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="cgv-su-van-hanh">CGV Sư Vạn Hạnh - Rạp 1</option>
              <option value="cgv-vincom-dong-khoi">CGV Vincom Đồng Khởi - Rạp 3</option>
              <option value="bhd-star-32">BHD Star 3/2 - Rạp 2</option>
              <option value="galaxy-nguyen-du">Galaxy Nguyễn Du - Rạp 5</option>
            </select>
          </div>

          {/* Ngày chiếu & Giờ chiếu */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ngày Chiếu & Giờ Chiếu</span>
            </label>
            <input
              type="datetime-local"
              name="ngayChieuGioChieu"
              required
              min={minDateTimeStr}
              value={formData.ngayChieuGioChieu}
              onChange={handleChange}
              onKeyDown={(e) => e.preventDefault()}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>

          {/* Giá vé */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giá Vé (VND)</span>
            </label>
            <input
              type="number"
              name="giaVe"
              step="5000"
              min="50000"
              max="200000"
              required
              value={formData.giaVe}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium text-sm transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Tạo Lịch Chiếu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
