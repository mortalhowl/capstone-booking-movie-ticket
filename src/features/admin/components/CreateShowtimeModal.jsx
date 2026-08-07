import { useState, useEffect } from "react";
import { X, Calendar, Clock, Building2, Ticket, Check, AlertCircle, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import api from "@/services/api";

export default function CreateShowtimeModal({ isOpen, onClose, movie, moviesList = [], onSubmitSuccess }) {
  const [selectedMovieIdModal, setSelectedMovieIdModal] = useState("");
  const [heThongRapList, setHeThongRapList] = useState([]);
  const [cumRapList, setCumRapList] = useState([]);
  const [rapList, setRapList] = useState([]);
  
  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [selectedCumRap, setSelectedCumRap] = useState("");
  const [selectedRap, setSelectedRap] = useState("");

  // Target Movie được chọn (nếu truyền movie prop thì dùng movie, nếu không thì lấy theo dropdown)
  const activeMovie = movie || moviesList.find((m) => String(m.maPhim) === String(selectedMovieIdModal)) || moviesList[0];

  useEffect(() => {
    if (isOpen) {
      if (movie) {
        setSelectedMovieIdModal(movie.maPhim);
      } else if (moviesList.length > 0) {
        setSelectedMovieIdModal(moviesList[0].maPhim);
      }
    }
  }, [isOpen, movie, moviesList]);

  // 1. Fetch Danh sách Hệ thống rạp khi mở modal
  useEffect(() => {
    if (isOpen) {
      setFormError("");
      setLoadingSystems(true);
      api
        .get("QuanLyRap/LayThongTinHeThongRap")
        .then((res) => {
          const systems = res.data?.content || [];
          setHeThongRapList(systems);
          if (systems.length > 0) {
            setSelectedHeThong(systems[0].maHeThongRap);
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy danh sách hệ thống rạp:", err);
          setFormError("Không thể tải danh sách hệ thống rạp");
        })
        .finally(() => setLoadingSystems(false));
    }
  }, [isOpen]);

  // 2. Fetch Cụm rạp khi Hệ thống rạp thay đổi
  useEffect(() => {
    if (selectedHeThong) {
      setLoadingCumRap(true);
      setCumRapList([]);
      setRapList([]);
      setSelectedCumRap("");
      setSelectedRap("");

      api
        .get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${selectedHeThong}`)
        .then((res) => {
          const clusters = res.data?.content || [];
          setCumRapList(clusters);
          if (clusters.length > 0) {
            const firstCluster = clusters[0];
            setSelectedCumRap(firstCluster.maCumRap);
          } else {
            setSelectedCumRap("");
            setRapList([]);
            setSelectedRap("");
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy cụm rạp:", err);
          setFormError("Không thể tải danh sách cụm rạp");
        })
        .finally(() => setLoadingCumRap(false));
    }
  }, [selectedHeThong]);

  // 3. Tự động đồng bộ Phòng rạp khi Cụm rạp hoặc cumRapList thay đổi
  useEffect(() => {
    if (selectedCumRap && cumRapList.length > 0) {
      const currentCluster = cumRapList.find((c) => c.maCumRap === selectedCumRap);
      if (currentCluster && currentCluster.danhSachRap?.length > 0) {
        const list = currentCluster.danhSachRap;
        setRapList(list);
        const isRapValid = list.some((r) => String(r.maRap) === String(selectedRap));
        if (!isRapValid) {
          setSelectedRap(list[0].maRap);
        }
      } else {
        setRapList([]);
        setSelectedRap("");
      }
    } else {
      setRapList([]);
      setSelectedRap("");
    }
  }, [selectedCumRap, cumRapList]);

  const handleCumRapChange = (maCumRap) => {
    setSelectedCumRap(maCumRap);
  };

  if (!isOpen) return null;

  if (!activeMovie) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-300 font-semibold">Đang tải danh sách phim từ hệ thống...</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedRap) {
      setFormError("Vui lòng chọn rạp chiếu!");
      return;
    }

    if (!selectedDate) {
      setFormError("Vui lòng chọn ngày chiếu!");
      return;
    }

    if (!selectedTimeSlot) {
      setFormError("Vui lòng chọn suất chiếu hợp lệ!");
      return;
    }

    if (isSlotDisabled(selectedTimeSlot, selectedDate)) {
      setFormError("Suất chiếu này đã qua trong quá khứ! Vui lòng chọn suất chiếu khác.");
      return;
    }

    // Định dạng ngày chiếu chuẩn DD/MM/YYYY HH:mm:ss theo API CyberSoft
    const [h, m] = selectedTimeSlot.split(":");
    const fullDateTimeObj = dayjs(selectedDate).hour(Number(h)).minute(Number(m));
    const formattedDate = fullDateTimeObj.format("DD/MM/YYYY HH:mm:ss");

    const payload = {
      maPhim: Number(activeMovie.maPhim),
      ngayChieuGioChieu: formattedDate,
      maRap: selectedCumRap || selectedRap, // API CyberSoft yêu cầu truyền Mã Cụm Rạp (chuỗi maCumRap như 'bhd-star-cineplex-3-2') vào tham số maRap
      giaVe: Number(giaVe),
    };

    if (onSubmitSuccess) {
      onSubmitSuccess(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Tạo Lịch Chiếu Phim</h2>
              <p className="text-xs text-slate-400">Thiết lập thời gian & rạp chiếu trực tiếp từ CyberSoft API</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Chọn Phim (Nếu mở từ nút Top Header không truyền movie sẵn) */}
          {!movie && moviesList.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                <span>1. Chọn Bộ Phim Chiếu</span>
              </label>
              <select
                value={selectedMovieIdModal}
                onChange={(e) => setSelectedMovieIdModal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {moviesList.map((m) => (
                  <option key={m.maPhim} value={m.maPhim}>
                    [{m.maPhim}] {m.tenPhim}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Target Movie Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3">
            <img
              src={activeMovie.hinhAnh}
              alt={activeMovie.tenPhim}
              className="w-12 h-16 object-cover rounded-lg border border-slate-800"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x200?text=No+Poster";
              }}
            />
            <div>
              <span className="text-[11px] font-mono text-blue-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                Mã Phim: #{activeMovie.maPhim}
              </span>
              <h4 className="font-bold text-sm text-slate-100 mt-1">{activeMovie.tenPhim}</h4>
              <p className="text-xs text-slate-400">Tạo suất chiếu mới kết nối hệ thống rạp thực tế</p>
            </div>
          </div>

          {/* Chọn Hệ thống rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hệ Thống Rạp</span>
            </label>
            {loadingSystems ? (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tải danh sách hệ thống rạp...</span>
              </div>
            ) : (
              <select
                name="maHeThongRap"
                value={selectedHeThong}
                onChange={(e) => setSelectedHeThong(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {heThongRapList.map((sys) => (
                  <option key={sys.maHeThongRap} value={sys.maHeThongRap}>
                    {sys.tenHeThongRap} ({sys.maHeThongRap})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Chọn Cụm Rạp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Cụm Rạp Chiếu (Địa Điểm)</span>
              {cumRapList.length > 0 && (
                <span className="text-[10px] text-indigo-400 font-mono">
                  {cumRapList.length} cụm rạp
                </span>
              )}
            </label>
            {loadingCumRap ? (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tải danh sách cụm rạp...</span>
              </div>
            ) : (
              <select
                name="maCumRap"
                value={selectedCumRap}
                onChange={(e) => handleCumRapChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {cumRapList.map((cum) => (
                  <option key={cum.maCumRap} value={cum.maCumRap}>
                    {cum.tenCumRap} — {cum.diaChi}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Chọn Phòng Rạp Chiếu */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Phòng Rạp Chiếu (Mã Rạp)</span>
              {rapList.length > 0 && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {rapList.length} phòng
                </span>
              )}
            </label>
            {rapList.length === 0 ? (
              <p className="text-xs text-amber-400">Không tìm thấy phòng rạp.</p>
            ) : (
              <select
                name="maRap"
                value={selectedRap}
                onChange={(e) => setSelectedRap(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {rapList.map((r) => (
                  <option key={r.maRap} value={r.maRap}>
                    {r.tenRap} — Mã rạp: #{r.maRap}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Ngày chiếu */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ngày Chiếu</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-normal">*(Không nhập tay, chỉ chọn từ lịch)</span>
            </label>
            <input
              type="date"
              name="ngayChieu"
              required
              min={minDate}
              value={selectedDate}
              onKeyDown={(e) => e.preventDefault()}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setFormError("");
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer select-none"
            />
          </div>

          {/* Chọn Giờ Chiếu Cố Định */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Suất Chiếu Cố Định</span>
              </span>
              <span className="text-[10px] text-amber-400 font-normal">
                {dayjs(selectedDate).isSame(dayjs(), "day") ? "*(Khóa giờ đã qua hôm nay)" : "*(Khả dụng)"}
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {SHOWTIME_SLOTS.map((slot) => {
                const disabled = isSlotDisabled(slot, selectedDate);
                const isSelected = selectedTimeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedTimeSlot(slot);
                      setFormError("");
                    }}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                      disabled
                        ? "bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed line-through opacity-40"
                        : isSelected
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span>{slot}</span>
                  </button>
                );
              })}
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
              name="giaVe"
              step="5000"
              min="50000"
              max="200000"
              required
              value={giaVe}
              onChange={(e) => setGiaVe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center space-x-2 mt-2">
              {[75000, 90000, 120000, 150000].map((price) => (
                <button
                  type="button"
                  key={price}
                  onClick={() => setGiaVe(price)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    Number(giaVe) === price
                      ? "bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {price.toLocaleString("vi-VN")}đ
                </button>
              ))}
            </div>
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

