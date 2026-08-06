import { useState, useEffect } from "react";
import { X, Calendar, Clock, Building2, Ticket, Check, Tv, MapPin } from "lucide-react";
import api from "@/services/api";

export default function CreateShowtimeModal({ isOpen, onClose, movie, onSubmitSuccess }) {
  const [cinemaSystems, setCinemaSystems] = useState([]);
  const [cinemaClusters, setCinemaClusters] = useState([]);

  const [maHeThongRap, setMaHeThongRap] = useState("");
  const [maCumRap, setMaCumRap] = useState("");
  const [maRap, setMaRap] = useState("");
  
  // Tách biệt Ngày Chiếu và Giờ Chiếu để chọn cực kỳ dễ dàng
  const [ngayChieu, setNgayChieu] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [gioChieu, setGioChieu] = useState("19:00");
  const [giaVe, setGiaVe] = useState(90000);

  // Danh sách các khung giờ chiếu phổ biến để người dùng chọn nhanh từ dropdown
  const timeSlots = [
    "08:30", "09:45", "11:00", "13:15", "14:30", 
    "16:00", "17:30", "19:00", "20:30", "22:00"
  ];

  // 1. Fetch hệ thống rạp khi modal mở
  useEffect(() => {
    if (isOpen) {
      api.get("QuanLyRap/LayThongTinHeThongRap")
        .then((res) => {
          const sys = res.data.content || [];
          setCinemaSystems(sys);
          if (sys.length > 0) {
            setMaHeThongRap(sys[0].maHeThongRap);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // 2. Fetch cụm rạp khi chọn hệ thống rạp
  useEffect(() => {
    if (maHeThongRap) {
      api.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`)
        .then((res) => {
          const clusters = res.data.content || [];
          setCinemaClusters(clusters);
          if (clusters.length > 0) {
            setMaCumRap(clusters[0].maCumRap);
            if (clusters[0].danhSachRap?.length > 0) {
              setMaRap(String(clusters[0].danhSachRap[0].maRap));
            }
          }
        })
        .catch(() => {});
    }
  }, [maHeThongRap]);

  // 3. Khi đổi cụm rạp -> tự động chọn rạp đầu tiên
  const handleClusterChange = (e) => {
    const clusterId = e.target.value;
    setMaCumRap(clusterId);
    const selectedCluster = cinemaClusters.find((c) => c.maCumRap === clusterId);
    if (selectedCluster && selectedCluster.danhSachRap?.length > 0) {
      setMaRap(String(selectedCluster.danhSachRap[0].maRap));
    }
  };

  if (!isOpen || !movie) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ngayChieu || !gioChieu) {
      alert("Vui lòng chọn Ngày chiếu và Giờ chiếu!");
      return;
    }

    // Kiểm tra không cho tạo lịch chiếu ở quá khứ
    const selectedDateTime = new Date(`${ngayChieu}T${gioChieu}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("Thời gian chiếu không hợp lệ! Vui lòng chọn ngày & giờ từ thời điểm hiện tại trở về sau.");
      return;
    }

    // Ghép Ngày + Giờ thành định dạng YYYY-MM-DDTHH:mm
    const ngayChieuGioChieuCombined = `${ngayChieu}T${gioChieu}`;

    if (onSubmitSuccess) {
      onSubmitSuccess({
        maPhim: movie.maPhim,
        maRap: maCumRap || maRap,
        ngayChieuGioChieu: ngayChieuGioChieuCombined,
        giaVe: Number(giaVe),
      });
    }
    onClose();
  };

  const selectedCluster = cinemaClusters.find((c) => c.maCumRap === maCumRap);

  // Kiểm tra xem time slot có ở quá khứ so với thời điểm hiện tại hay không
  const isTimeSlotPast = (slot) => {
    if (ngayChieu !== todayStr) return false; // Nếu chọn ngày tương lai thì cho phép tất cả các giờ
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [h, m] = slot.split(":").map(Number);

    if (h < currentHour) return true;
    if (h === currentHour && m <= currentMinute) return true;
    return false;
  };

  // Tự động chọn khung giờ hợp lệ đầu tiên nếu giờ hiện tại đã bị trôi qua
  useEffect(() => {
    if (ngayChieu === todayStr) {
      const validSlot = timeSlots.find((slot) => !isTimeSlotPast(slot));
      if (validSlot) {
        setGioChieu(validSlot);
      }
    }
  }, [ngayChieu]);

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
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
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
              <p className="text-xs text-slate-400">Tạo suất chiếu mới từ máy chủ CyberSoft</p>
            </div>
          </div>

          {/* Chọn Hệ thống rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hệ Thống Rạp</span>
            </label>
            <select
              value={maHeThongRap}
              onChange={(e) => setMaHeThongRap(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {cinemaSystems.map((sys) => (
                <option key={sys.maHeThongRap} value={sys.maHeThongRap}>
                  {sys.tenHeThongRap} ({sys.maHeThongRap})
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Cụm Rạp & Rạp Con */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cụm Rạp</span>
              </label>
              <select
                value={maCumRap}
                onChange={handleClusterChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {cinemaClusters.map((c) => (
                  <option key={c.maCumRap} value={c.maCumRap}>
                    {c.tenCumRap}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Tv className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rạp Con</span>
              </label>
              <select
                value={maRap}
                onChange={(e) => setMaRap(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {selectedCluster?.danhSachRap?.map((r) => (
                  <option key={r.maRap} value={r.maRap}>
                    {r.tenRap} (#{r.maRap})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NGÀY CHIẾU VÀ GIỜ CHIẾU TÁCH RIÊNG ĐỄ BẤM CHỌN DỄ DÀNG */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Ngày Chiếu với Lịch chọn dễ dàng */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ngày Chiếu</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={ngayChieu}
                onChange={(e) => setNgayChieu(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{ colorScheme: "dark" }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>

            {/* 2. Giờ Chiếu với danh sách Dropdown Khung Giờ */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Giờ Chiếu</span>
              </label>
              <select
                value={gioChieu}
                onChange={(e) => setGioChieu(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {timeSlots.map((slot) => {
                  const isPast = isTimeSlotPast(slot);
                  return (
                    <option key={slot} value={slot} disabled={isPast} className={isPast ? "text-slate-600 bg-slate-950" : ""}>
                      {slot} {isPast ? "(Đã qua)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Giá vé */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giá Vé (VND)</span>
            </label>
            <input
              type="number"
              step="5000"
              min="50000"
              max="200000"
              required
              value={giaVe}
              onChange={(e) => setGiaVe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
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
