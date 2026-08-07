import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { fetchListMovie, actCreateShowtime, clearStatusMessage } from "@/features/admin/slice";
import api from "@/services/api";
import CreateShowtimeModal from "@/features/admin/components/CreateShowtimeModal";
import {
  Calendar,
  Film,
  Building2,
  Clock,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
  Sparkles,
  MapPin,
  Check,
  Search,
  Filter,
  RefreshCw,
  List,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Hàm hỗ trợ tìm kiếm tiếng Việt không phân biệt dấu và chữ hoa/thường
const removeAccents = (str) => {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

export default function AdminShowtimePage() {
  const dispatch = useDispatch();

  // State từ Redux Store
  const { data: apiMovies, loading: reduxLoading, error: reduxError, successMessage } = useSelector(
    (state) => state.adminMovie
  );

  const movies = Array.isArray(apiMovies) ? apiMovies : [];

  // State quản lý tab & Modal
  const [activeTab, setActiveTab] = useState("list"); // 'list' | 'form'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMovie, setModalMovie] = useState(null); // Movie truyền vào modal nếu có

  // State danh sách lịch chiếu từ API
  const [showtimesList, setShowtimesList] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSystem, setFilterSystem] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State quản lý form tạo lịch chiếu inline
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [heThongRapList, setHeThongRapList] = useState([]);
  const [cumRapList, setCumRapList] = useState([]);
  const [rapList, setRapList] = useState([]);

  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [selectedCumRap, setSelectedCumRap] = useState("");
  const [selectedRap, setSelectedRap] = useState("");

  // Danh sách suất chiếu cố định chuẩn hệ thống rạp
  const SHOWTIME_SLOTS = [
    "08:30",
    "10:45",
    "13:00",
    "15:15",
    "17:30",
    "19:45",
    "21:30",
    "23:00",
  ];

  // State quản lý ngày chiếu & khung giờ chiếu cố định
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [giaVe, setGiaVe] = useState(90000);

  const minDate = dayjs().format("YYYY-MM-DD");

  // State UI
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [loadingCumRap, setLoadingCumRap] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // 1. Fetch danh sách phim nếu chưa có
  useEffect(() => {
    if (!apiMovies || apiMovies.length === 0) {
      dispatch(fetchListMovie());
    }
  }, [dispatch, apiMovies]);

  // Tự động chọn phim đầu tiên khi có dữ liệu form inline
  useEffect(() => {
    if (movies.length > 0 && !selectedMovieId) {
      setSelectedMovieId(movies[0].maPhim);
      setSelectedMovie(movies[0]);
    }
  }, [movies, selectedMovieId]);

  // Cập nhật selectedMovie khi selectedMovieId thay đổi
  const handleMovieChange = (maPhim) => {
    setSelectedMovieId(maPhim);
    const found = movies.find((m) => String(m.maPhim) === String(maPhim));
    setSelectedMovie(found || null);
  };

  // 2. Fetch Danh sách Lịch Chiếu từ toàn bộ 6 hệ thống rạp
  const fetchAllShowtimesData = async () => {
    setLoadingShowtimes(true);
    const systems = ["BHDStar", "CGV", "CineStar", "Galaxy", "LotteCinima", "MegaGS"];
    try {
      const promises = systems.map((sys) =>
        api.get(`QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${sys}&maNhom=GP01`)
      );
      const results = await Promise.all(promises);
      const allShowtimes = [];

      results.forEach((res) => {
        const content = res.data?.content || [];
        content.forEach((sys) => {
          sys.lstCumRap?.forEach((cum) => {
            cum.danhSachPhim?.forEach((phim) => {
              phim.lstLichChieuTheoPhim?.forEach((lc) => {
                allShowtimes.push({
                  maLichChieu: lc.maLichChieu,
                  maPhim: phim.maPhim,
                  tenPhim: phim.tenPhim,
                  hinhAnh: phim.hinhAnh,
                  maHeThongRap: sys.maHeThongRap,
                  tenHeThongRap: sys.tenHeThongRap,
                  logo: sys.logo,
                  maCumRap: cum.maCumRap,
                  tenCumRap: cum.tenCumRap,
                  tenRap: lc.tenRap,
                  ngayChieuGioChieu: lc.ngayChieuGioChieu,
                  giaVe: lc.giaVe,
                });
              });
            });
          });
        });
      });

      // Lọc CHỈ GIỮ LẠI các suất chiếu SẮP CHIẾU (ngày & giờ chiếu >= thời gian hiện tại)
      const now = dayjs();
      const upcomingShowtimes = allShowtimes.filter((st) => {
        const showtimeDate = dayjs(st.ngayChieuGioChieu);
        return showtimeDate.isAfter(now) || showtimeDate.isSame(now, "minute");
      });

      // Ưu tiên suất chiếu chuẩn bị chiếu gần nhất lên đầu trang (Tăng dần theo thời gian)
      upcomingShowtimes.sort((a, b) => dayjs(a.ngayChieuGioChieu).valueOf() - dayjs(b.ngayChieuGioChieu).valueOf());

      setShowtimesList(upcomingShowtimes);
    } catch (err) {
      console.error("Lỗi fetch danh sách lịch chiếu:", err);
    } finally {
      setLoadingShowtimes(false);
    }
  };

  useEffect(() => {
    fetchAllShowtimesData();
  }, []);

  // 3. Fetch Hệ thống rạp khi trang load cho Form Inline
  useEffect(() => {
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
        console.error("Lỗi lấy hệ thống rạp:", err);
        setErrorMessage("Không thể tải danh sách Hệ Thống Rạp từ máy chủ API");
      })
      .finally(() => setLoadingSystems(false));
  }, []);

  // 4. Fetch Cụm rạp theo Hệ thống rạp đã chọn (Mục 2 -> Mục 3)
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
          setErrorMessage("Không thể tải danh sách cụm rạp");
        })
        .finally(() => setLoadingCumRap(false));
    }
  }, [selectedHeThong]);

  // 5. Tự động đồng bộ Phòng rạp khi Cụm rạp hoặc cumRapList thay đổi
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

  // Kiểm tra khung giờ có bị trễ so với thời gian hiện tại nếu chọn HÔM NAY hay không
  const isSlotDisabled = (slotTime, dateStr) => {
    if (!dateStr) return true;
    const isToday = dayjs(dateStr).isSame(dayjs(), "day");
    if (isToday) {
      const [h, m] = slotTime.split(":").map(Number);
      const slotDateTime = dayjs(dateStr).hour(h).minute(m);
      return slotDateTime.isBefore(dayjs());
    }
    return dayjs(dateStr).isBefore(dayjs(), "day");
  };

  // Tự động chọn suất chiếu khả dụng đầu tiên khi chọn Ngày chiếu
  useEffect(() => {
    if (selectedDate) {
      const availableSlot = SHOWTIME_SLOTS.find(
        (slot) => !isSlotDisabled(slot, selectedDate)
      );
      if (availableSlot) {
        setSelectedTimeSlot(availableSlot);
      } else {
        setSelectedTimeSlot("");
      }
    }
  }, [selectedDate]);

  // Xử lý tạo lịch chiếu từ Form Inline
  const handleSubmitInline = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setToastMessage("");

    if (!selectedMovieId) {
      setErrorMessage("Vui lòng chọn bộ phim cần tạo lịch chiếu!");
      return;
    }

    if (!selectedCumRap || !selectedRap) {
      setErrorMessage("Vui lòng chọn cụm rạp và phòng rạp hợp lệ!");
      return;
    }

    if (!selectedDate) {
      setErrorMessage("Vui lòng chọn ngày chiếu!");
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage("Vui lòng chọn suất chiếu hợp lệ!");
      return;
    }

    if (isSlotDisabled(selectedTimeSlot, selectedDate)) {
      setErrorMessage("Suất chiếu này đã qua trong quá khứ! Vui lòng chọn suất chiếu khác.");
      return;
    }

    const [h, m] = selectedTimeSlot.split(":");
    const fullDateTimeObj = dayjs(selectedDate).hour(Number(h)).minute(Number(m));
    const formattedDate = fullDateTimeObj.format("DD/MM/YYYY HH:mm:ss");

    const payload = {
      maPhim: Number(selectedMovieId),
      ngayChieuGioChieu: formattedDate,
      maRap: selectedCumRap || selectedRap, // API CyberSoft yêu cầu truyền Mã Cụm Rạp (chuỗi maCumRap như 'bhd-star-cineplex-3-2') vào tham số maRap
      giaVe: Number(giaVe),
    };

    setSubmitting(true);
    try {
      await dispatch(actCreateShowtime(payload)).unwrap();
      setToastMessage(`Tạo thành công lịch chiếu lúc ${selectedTimeSlot} (${dayjs(selectedDate).format("DD/MM/YYYY")}) cho phim "${selectedMovie?.tenPhim || selectedMovieId}"!`);
      fetchAllShowtimesData(); // Tải lại danh sách lịch chiếu mới nhất
      setActiveTab("list"); // Chuyển về tab Danh sách lịch chiếu
    } catch (err) {
      setErrorMessage(typeof err === "string" ? err : "Tạo lịch chiếu thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý tạo lịch chiếu từ Modal
  const handleModalSubmitSuccess = async (payload) => {
    setErrorMessage("");
    setToastMessage("");
    setSubmitting(true);
    try {
      await dispatch(actCreateShowtime(payload)).unwrap();
      setToastMessage("Tạo thành công lịch chiếu phim mới!");
      fetchAllShowtimesData(); // Refetch
    } catch (err) {
      setErrorMessage(typeof err === "string" ? err : "Tạo lịch chiếu thất bại, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  // Tự động reset về trang 1 khi người dùng gõ từ khóa tìm kiếm hoặc đổi bộ lọc rạp
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSystem]);

  // Lọc danh sách lịch chiếu theo tên phim trên TOÀN BỘ dữ liệu hệ thống (không phân biệt dấu tiếng Việt)
  const filteredShowtimes = showtimesList.filter((st) => {
    const movieTitleClean = removeAccents(st.tenPhim);
    const searchClean = removeAccents(searchTerm);
    const matchSearch = !searchClean || movieTitleClean.includes(searchClean);
    const matchSystem = filterSystem === "ALL" || st.maHeThongRap === filterSystem;

    return matchSearch && matchSystem;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage) || 1;
  const paginatedShowtimes = filteredShowtimes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedClusterObj = cumRapList.find((c) => c.maCumRap === selectedCumRap);
  const selectedRapObj = rapList.find((r) => String(r.maRap) === String(selectedRap));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-5 py-3.5 rounded-2xl backdrop-blur-xl shadow-2xl animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-emerald-400 hover:text-emerald-200 ml-2 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Main Action Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <span>Quản Lý Lịch Chiếu</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              CyberSoft Live Sync ⚡
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cấu hình suất chiếu chuẩn hệ thống rạp & Quản lý danh sách lịch chiếu trực tuyến
          </p>
        </div>

        {/* Action Group Header Tabs */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-2xl flex items-center space-x-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "list"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-4 h-4" />
              <span>Danh Sách Lịch Chiếu</span>
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "form"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Lịch Chiếu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: TAB DANH SÁCH LỊCH CHIẾU */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto flex-1">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nhập tên phim để tìm kiếm lịch chiếu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                />
              </div>

              {/* Filter System Dropdown */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-indigo-400 hidden sm:block" />
                <select
                  value={filterSystem}
                  onChange={(e) => setFilterSystem(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="ALL">Tất cả hệ thống rạp</option>
                  <option value="BHDStar">BHD Star Cineplex</option>
                  <option value="CGV">CGV Cinema</option>
                  <option value="CineStar">CineStar</option>
                  <option value="Galaxy">Galaxy Cinema</option>
                  <option value="LotteCinima">Lotte Cinema</option>
                  <option value="MegaGS">MegaGS</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-400 font-mono">
                Tổng cộng: <strong className="text-indigo-400">{filteredShowtimes.length}</strong> suất chiếu
              </span>
              <button
                onClick={fetchAllShowtimesData}
                disabled={loadingShowtimes}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
                title="Tải lại danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${loadingShowtimes ? "animate-spin text-indigo-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Showtimes Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
            {loadingShowtimes ? (
              <div className="p-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-400">Đang đồng bộ danh sách lịch chiếu từ các hệ thống rạp...</p>
              </div>
            ) : paginatedShowtimes.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Film className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Không tìm thấy lịch chiếu phù hợp</p>
                <p className="text-xs text-slate-500">Chuyển sang tab "Thêm Lịch Chiếu" để tạo suất chiếu mới</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Mã Lịch Chiếu</th>
                      <th className="py-4 px-6">Bộ Phim Chiếu</th>
                      <th className="py-4 px-6">Hệ Thống Rạp</th>
                      <th className="py-4 px-6">Cụm & Phòng Rạp</th>
                      <th className="py-4 px-6">Thời Gian Chiếu</th>
                      <th className="py-4 px-6">Giá Vé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {paginatedShowtimes.map((st) => {
                      const isPast = dayjs(st.ngayChieuGioChieu).isBefore(dayjs());
                      return (
                        <tr key={st.maLichChieu} className="hover:bg-slate-800/40 transition-colors group">
                          {/* Mã lịch chiếu */}
                          <td className="py-4 px-6 font-mono text-indigo-400 font-bold">
                            #{st.maLichChieu}
                          </td>

                          {/* Bộ phim chiếu */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <img
                                src={st.hinhAnh}
                                alt={st.tenPhim}
                                className="w-9 h-12 object-cover rounded-lg border border-slate-800"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/150x200?text=No+Poster";
                                }}
                              />
                              <div>
                                <h4 className="font-bold text-slate-100 line-clamp-1">{st.tenPhim}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">Mã Phim: #{st.maPhim}</span>
                              </div>
                            </div>
                          </td>

                          {/* Hệ thống rạp */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              {st.logo ? (
                                <img src={st.logo} alt={st.tenHeThongRap} className="w-6 h-6 object-contain" />
                              ) : (
                                <Building2 className="w-4 h-4 text-indigo-400" />
                              )}
                              <span className="font-medium text-slate-200">{st.tenHeThongRap}</span>
                            </div>
                          </td>

                          {/* Cụm rạp & phòng */}
                          <td className="py-4 px-6 space-y-1">
                            <div className="font-semibold text-slate-200 line-clamp-1">{st.tenCumRap}</div>
                            <span className="inline-block bg-slate-950 border border-slate-800 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-mono">
                              {st.tenRap}
                            </span>
                          </td>

                          {/* Thời gian chiếu */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Clock className={`w-3.5 h-3.5 ${isPast ? "text-slate-500" : "text-amber-400"}`} />
                              <span className={`font-mono font-medium ${isPast ? "text-slate-500 line-through" : "text-emerald-400"}`}>
                                {dayjs(st.ngayChieuGioChieu).format("DD/MM/YYYY HH:mm")}
                              </span>
                            </div>
                            <span className={`text-[10px] block mt-0.5 ${isPast ? "text-slate-500" : "text-emerald-500/80 font-semibold"}`}>
                              {isPast ? "Đã chiếu" : "Sắp chiếu"}
                            </span>
                          </td>

                          {/* Giá vé */}
                          <td className="py-4 px-6 font-bold text-amber-400 font-mono">
                            {Number(st.giaVe).toLocaleString("vi-VN")} VNĐ
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Footer */}
            {!loadingShowtimes && filteredShowtimes.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredShowtimes.length)} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredShowtimes.length)} trên tổng {filteredShowtimes.length} mục
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-indigo-400 px-3">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: TAB FORM THIẾT LẬP LỊCH CHIẾU INLINE */}
      {activeTab === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Configurator (2 Cột) */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Header Form */}
            <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Form Thiết Lập Lịch Chiếu Trực Tiếp</h2>
                  <p className="text-xs text-slate-400">Điền đầy đủ các tham số cấu hình lịch chiếu</p>
                </div>
              </div>
            </div>

            {/* Notification Messages */}
            {errorMessage && (
              <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitInline} className="space-y-6">
              {/* 1. Chọn Bộ Phim Chiếu */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Film className="w-4 h-4 text-indigo-400" />
                  <span>1. CHỌN BỘ PHIM CHIẾU</span>
                </label>
                {reduxLoading ? (
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tải danh sách phim...</span>
                  </div>
                ) : (
                  <select
                    value={selectedMovieId}
                    onChange={(e) => handleMovieChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                  >
                    {movies.map((m) => (
                      <option key={m.maPhim} value={m.maPhim}>
                        [{m.maPhim}] {m.tenPhim} {m.hot ? "🔥" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* 2. Chọn Hệ Thống Rạp */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>2. CHỌN HỆ THỐNG RẠP</span>
                </label>
                {loadingSystems ? (
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kết nối hệ thống rạp...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {heThongRapList.map((sys) => {
                      const isSelected = selectedHeThong === sys.maHeThongRap;
                      return (
                        <button
                          type="button"
                          key={sys.maHeThongRap}
                          onClick={() => setSelectedHeThong(sys.maHeThongRap)}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                            isSelected
                              ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <img
                            src={sys.logo}
                            alt={sys.tenHeThongRap}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/50?text=Cinema";
                            }}
                          />
                          <span className="text-[10px] font-semibold truncate w-full text-center">
                            {sys.tenHeThongRap}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3 & 4. Cụm Rạp & Phòng Rạp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3. Cụm Rạp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>3. Cụm Rạp (Địa Điểm)</span>
                    </span>
                    {cumRapList.length > 0 && (
                      <span className="text-[10px] font-mono text-indigo-400">
                        {cumRapList.length} cụm rạp
                      </span>
                    )}
                  </label>
                  {loadingCumRap ? (
                    <div className="flex items-center space-x-2 text-xs text-indigo-400 py-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải cụm rạp...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedCumRap}
                      onChange={(e) => setSelectedCumRap(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-medium truncate"
                    >
                      {cumRapList.map((c) => (
                        <option key={c.maCumRap} value={c.maCumRap}>
                          {c.tenCumRap} — {c.diaChi}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 4. Phòng Rạp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>4. Phòng Rạp (Mã Rạp)</span>
                    </span>
                    {rapList.length > 0 && (
                      <span className="text-[10px] font-mono text-indigo-400">
                        {rapList.length} phòng
                      </span>
                    )}
                  </label>
                  <select
                    value={selectedRap}
                    onChange={(e) => setSelectedRap(e.target.value)}
                    disabled={rapList.length === 0}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors font-medium disabled:opacity-50"
                  >
                    {rapList.map((r) => (
                      <option key={r.maRap} value={r.maRap}>
                        {r.tenRap} — Mã rạp: #{r.maRap}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Chọn Ngày Chiếu */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>5. Chọn Ngày Chiếu</span>
                  </span>
                  <span className="text-[10px] text-slate-500 italic">
                    *(Khóa ngày quá khứ)
                  </span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* 6. Chọn Suất Chiếu Cố Định */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>6. Khung Giờ Chiếu Cố Định</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {SHOWTIME_SLOTS.map((slot) => {
                    const disabled = isSlotDisabled(slot, selectedDate);
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={disabled}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                          disabled
                            ? "bg-slate-950/40 border-slate-800/40 text-slate-600 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-105"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Giá Vé */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Ticket className="w-4 h-4 text-indigo-400" />
                  <span>7. Giá Vé Mỗi Ghế (VNĐ)</span>
                </label>
                <input
                  type="number"
                  step="5000"
                  min="50000"
                  max="200000"
                  value={giaVe}
                  onChange={(e) => setGiaVe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono font-bold text-amber-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang khởi tạo lịch chiếu...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Xác Nhận Tạo Lịch Chiếu Phim</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Live Preview Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl h-fit space-y-6">
            <div className="border-b border-slate-800/80 pb-4 flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">Thẻ Xem Trước Lịch Chiếu (Live Preview)</h3>
            </div>

            {selectedMovie ? (
              <div className="space-y-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={selectedMovie.hinhAnh}
                    alt={selectedMovie.tenPhim}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x400?text=No+Poster";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono text-indigo-300 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded border border-slate-700">
                      Mã Phim: #{selectedMovie.maPhim}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{selectedMovie.tenPhim}</h4>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Cụm Rạp Chiếu:</span>
                    <span className="font-semibold text-slate-200 text-right line-clamp-1">{selectedClusterObj?.tenCumRap || "Chưa chọn"}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Phòng Chiếu:</span>
                    <span className="font-mono text-indigo-400 font-bold">{selectedRapObj?.tenRap || "Chưa chọn"}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Thời Gian Chiếu:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "--"} {selectedTimeSlot ? `- ${selectedTimeSlot}` : ""}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Giá Vé Mỗi Ghế:</span>
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {Number(giaVe).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Vui lòng chọn bộ phim để xem trước thẻ lịch chiếu
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global CreateShowtimeModal */}
      <CreateShowtimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={modalMovie}
        moviesList={movies}
        onSubmitSuccess={handleModalSubmitSuccess}
      />
    </div>
  );
}
