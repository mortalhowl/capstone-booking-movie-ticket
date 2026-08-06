import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoviesForShowtime,
  fetchCinemaSystems,
  fetchCinemaClusters,
  actCreateShowtime,
  clearShowtimeStatus,
} from "@/features/admin/showtimeSlice";
import {
  Calendar,
  Film,
  Building2,
  MapPin,
  Clock,
  Ticket,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Tv,
} from "lucide-react";

export default function AdminShowtimePage() {
  const dispatch = useDispatch();

  const {
    movies,
    cinemaSystems,
    cinemaClusters,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.adminShowtime);

  // Form State
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [selectedClusterId, setSelectedClusterId] = useState("");
  const [selectedRapId, setSelectedRapId] = useState("");
  const [ngayChieu, setNgayChieu] = useState(() => new Date().toISOString().split("T")[0]);
  const [gioChieu, setGioChieu] = useState("19:00");
  const [giaVe, setGiaVe] = useState(90000);

  const timeSlots = [
    "08:30", "09:45", "11:00", "13:15", "14:30", 
    "16:00", "17:30", "19:00", "20:30", "22:00"
  ];

  // Local Toast notification
  const [toastMsg, setToastMsg] = useState("");

  /**
   * 1. On Mount: Fetch danh sách Phim & Hệ thống Rạp
   */
  useEffect(() => {
    dispatch(fetchMoviesForShowtime());
    dispatch(fetchCinemaSystems());
  }, [dispatch]);

  /**
   * 2. Auto-select first movie & first system when loaded
   */
  useEffect(() => {
    if (movies.length > 0 && !selectedMovieId) {
      setSelectedMovieId(String(movies[0].maPhim));
    }
  }, [movies, selectedMovieId]);

  useEffect(() => {
    if (cinemaSystems.length > 0 && !selectedSystemId) {
      const firstSys = cinemaSystems[0].maHeThongRap;
      setSelectedSystemId(firstSys);
      dispatch(fetchCinemaClusters(firstSys));
    }
  }, [cinemaSystems, selectedSystemId, dispatch]);

  /**
   * 3. Khi thay đổi Hệ thống Rạp -> Dispatch lấy Cụm Rạp tương ứng
   */
  const handleSystemChange = (e) => {
    const sysId = e.target.value;
    setSelectedSystemId(sysId);
    setSelectedClusterId("");
    setSelectedRapId("");
    dispatch(fetchCinemaClusters(sysId));
  };

  /**
   * 4. Khi thay đổi Cụm Rạp -> Auto chọn Rạp con đầu tiên
   */
  const handleClusterChange = (e) => {
    const clusterId = e.target.value;
    setSelectedClusterId(clusterId);
    const clusterObj = cinemaClusters.find((c) => c.maCumRap === clusterId);
    if (clusterObj && clusterObj.danhSachRap?.length > 0) {
      setSelectedRapId(String(clusterObj.danhSachRap[0].maRap));
    } else {
      setSelectedRapId("");
    }
  };

  // Auto-set cluster & rap when clusters load
  useEffect(() => {
    if (cinemaClusters.length > 0 && !selectedClusterId) {
      const firstCluster = cinemaClusters[0];
      setSelectedClusterId(firstCluster.maCumRap);
      if (firstCluster.danhSachRap?.length > 0) {
        setSelectedRapId(String(firstCluster.danhSachRap[0].maRap));
      }
    }
  }, [cinemaClusters, selectedClusterId]);

  /**
   * 5. Hiển thị thông báo Toast khi successMessage thay đổi
   */
  useEffect(() => {
    if (successMessage) {
      setToastMsg(successMessage);
      const timer = setTimeout(() => {
        setToastMsg("");
        dispatch(clearShowtimeStatus());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Phim được chọn hiện tại
  const selectedMovie = movies.find((m) => String(m.maPhim) === String(selectedMovieId));
  // Cụm rạp được chọn hiện tại
  const selectedCluster = cinemaClusters.find((c) => c.maCumRap === selectedClusterId);

  /**
   * 6. Submit Form Tạo Lịch Chiếu
   */
  const todayStr = new Date().toISOString().split("T")[0];

  // Kiểm tra xem time slot có ở quá khứ so với thời điểm hiện tại hay không
  const isTimeSlotPast = (slot) => {
    if (ngayChieu !== todayStr) return false;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovieId || !selectedClusterId || !ngayChieu || !gioChieu || !giaVe) {
      alert("Vui lòng điền đầy đủ các thông tin cần thiết!");
      return;
    }

    // Kiểm tra không cho tạo lịch chiếu ở quá khứ
    const selectedDateTime = new Date(`${ngayChieu}T${gioChieu}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("Thời gian chiếu không hợp lệ! Vui lòng chọn ngày & giờ từ thời điểm hiện tại trở về sau.");
      return;
    }

    const ngayChieuGioChieuCombined = `${ngayChieu}T${gioChieu}`;

    dispatch(
      actCreateShowtime({
        maPhim: selectedMovieId,
        maRap: selectedClusterId,
        ngayChieuGioChieu: ngayChieuGioChieuCombined,
        giaVe,
      })
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-3 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-bounce">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-500" />
            <span>Tạo Lịch Chiếu Phim</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cấu hình thời gian xuất chiếu, cụm rạp và đặt giá vé cho các bộ phim trên hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>API CyberSoft Connected</span>
        </div>
      </div>

      {/* Alert Lỗi nếu có */}
      {error && (
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        </div>
      )}

      {/* Main Grid: Form Left + Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
        >
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-200">Thông Tin Suất Chiếu</h2>
            <p className="text-xs text-slate-400">Chọn phim, rạp chiếu và thiết lập lịch chiếu</p>
          </div>

          {/* 1. Chọn Phim */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Film className="w-4 h-4 text-indigo-400" />
              <span>1. Chọn Phim</span>
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
            >
              {movies.map((m) => (
                <option key={m.maPhim} value={m.maPhim}>
                  [{m.maPhim}] {m.tenPhim}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Chọn Hệ Thống Rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>2. Chọn Hệ Thống Rạp</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {cinemaSystems.map((sys) => {
                const isSelected = sys.maHeThongRap === selectedSystemId;
                return (
                  <button
                    key={sys.maHeThongRap}
                    type="button"
                    onClick={() => handleSystemChange({ target: { value: sys.maHeThongRap } })}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <img
                      src={sys.logo}
                      alt={sys.tenHeThongRap}
                      className="w-8 h-8 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                    <span className="text-[10px] font-bold truncate max-w-full">
                      {sys.tenHeThongRap}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Chọn Cụm Rạp & Rạp Con */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>3. Cụm Rạp</span>
              </label>
              <select
                value={selectedClusterId}
                onChange={handleClusterChange}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors"
              >
                <option value="">-- Chọn cụm rạp --</option>
                {cinemaClusters.map((c) => (
                  <option key={c.maCumRap} value={c.maCumRap}>
                    {c.tenCumRap}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Tv className="w-4 h-4 text-indigo-400" />
                <span>4. Chọn Rạp Chiếu</span>
              </label>
              <select
                value={selectedRapId}
                onChange={(e) => setSelectedRapId(e.target.value)}
                disabled={!selectedCluster}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors disabled:opacity-50"
              >
                <option value="">-- Chọn rạp --</option>
                {selectedCluster?.danhSachRap?.map((r) => (
                  <option key={r.maRap} value={r.maRap}>
                    {r.tenRap} (Mã: {r.maRap})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Ngày chiếu/Giờ chiếu & Giá Vé */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>5. Ngày Chiếu</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={ngayChieu}
                onChange={(e) => setNgayChieu(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{ colorScheme: "dark" }}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>6. Giờ Chiếu</span>
              </label>
              <select
                value={gioChieu}
                onChange={(e) => setGioChieu(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors cursor-pointer"
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Ticket className="w-4 h-4 text-indigo-400" />
                <span>7. Giá Vé (VNĐ)</span>
              </label>
              <input
                type="number"
                step="5000"
                min="50000"
                max="200000"
                required
                value={giaVe}
                onChange={(e) => setGiaVe(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-colors font-mono font-semibold"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang Tạo Lịch Chiếu...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>TẠO LỊCH CHIẾU PHIM</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Xem Trước Xuất Chiếu (Preview)
            </h3>

            {selectedMovie ? (
              <div className="space-y-4">
                <div className="flex space-x-4 items-start">
                  <img
                    src={selectedMovie.hinhAnh}
                    alt={selectedMovie.tenPhim}
                    className="w-24 h-32 object-cover rounded-2xl border border-slate-800 shadow-md flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150x200?text=No+Poster";
                    }}
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono font-semibold border border-blue-500/20">
                      Mã Phim: #{selectedMovie.maPhim}
                    </span>
                    <h4 className="font-bold text-slate-100 text-base leading-snug line-clamp-2">
                      {selectedMovie.tenPhim}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {selectedMovie.moTa || "Chưa có mô tả ngắn"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Hệ Thống Rạp:</span>
                    <span className="font-bold text-indigo-400">{selectedSystemId || "Chưa chọn"}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Cụm Rạp:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                      {selectedCluster?.tenCumRap || "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Rạp Con:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedRapId ? `Mã Rạp: #${selectedRapId}` : "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Thời Gian:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {ngayChieu} {gioChieu}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 border-t border-slate-800 pt-2 mt-2">
                    <span className="text-slate-400">Giá Vé Niêm Yết:</span>
                    <span className="font-mono text-amber-400 font-extrabold text-sm">
                      {Number(giaVe).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Vui lòng chọn phim để xem trước lịch chiếu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
