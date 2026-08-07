import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchListMovie,
  actAddMovie,
  actUpdateMovie,
  actDeleteMovie,
  actCreateShowtime,
  clearStatusMessage,
} from "@/features/admin/slice";
import {
  MovieListTable,
  MovieFormModal,
  DeleteMovieModal,
  CreateShowtimeModal,
} from "@/features/admin";
import { Film, Flame, Calendar, Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminMoviePage() {
  const dispatch = useDispatch();

  /**
   * Lấy dữ liệu thuần 100% từ Redux Store (gọi từ API CyberSoft)
   */
  const { loading, data: apiMovies, error, successMessage } = useSelector(
    (state) => state.adminMovie
  );

  // Danh sách phim 100% từ API, nếu chưa có thì để mảng rỗng
  const movies = apiMovies && Array.isArray(apiMovies) ? apiMovies : [];

  // State điều khiển các Modal Popup
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMovieForEdit, setSelectedMovieForEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovieForDelete, setSelectedMovieForDelete] = useState(null);

  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [selectedMovieForShowtime, setSelectedMovieForShowtime] = useState(null);

  // Thong bao Toast UI
  const [toastMessage, setToastMessage] = useState("");

  /**
   * useEffect: Gọi API lấy danh sách phim từ máy chủ CyberSoft
   */
  useEffect(() => {
    dispatch(fetchListMovie());
  }, [dispatch]);

  /**
   * Hiển thị thông báo Toast thông qua Redux successMessage
   */
  useEffect(() => {
    if (successMessage) {
      setToastMessage(successMessage);
      const timer = setTimeout(() => {
        setToastMessage("");
        dispatch(clearStatusMessage());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  /**
   * 1. Xử lý mở Modal Thêm Phim Mới
   */
  const handleOpenAddModal = () => {
    setSelectedMovieForEdit(null);
    setIsFormModalOpen(true);
  };

  /**
   * 2. Xử lý mở Modal Sửa Phim
   */
  const handleOpenEditModal = (movie) => {
    setSelectedMovieForEdit(movie);
    setIsFormModalOpen(true);
  };

  /**
   * 3. Xử lý mở Modal Xóa Phim
   */
  const handleOpenDeleteModal = (movie) => {
    setSelectedMovieForDelete(movie);
    setIsDeleteModalOpen(true);
  };

  /**
   * 4. Xử lý mở Modal Tạo Lịch Chiếu
   */
  const handleOpenShowtimeModal = (movie) => {
    setSelectedMovieForShowtime(movie);
    setIsShowtimeModalOpen(true);
  };

  /**
   * Hàm chuyển đổi ngày sang định dạng dd/MM/yyyy chuẩn CyberSoft API
   */
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return dayjs().format("DD/MM/YYYY");
    const str = String(dateStr).trim();
    if (str.includes("/")) {
      const parts = str.split(" ")[0].split("/");
      if (parts.length === 3) {
        return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
      }
    }
    if (str.includes("-")) {
      const parts = str.split(" ")[0].split("-");
      if (parts.length === 3) {
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
      }
    }
    const dObj = dayjs(dateStr);
    return dObj.isValid() ? dObj.format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY");
  };

  /**
   * 5. Xử lý khi Submit Form Thêm hoặc Sửa Phim (Đóng gói FormData gửi trực tiếp lên API)
   */
  const handleFormSubmitSuccess = (formData, isEditMode) => {
    const formDataObj = new FormData();

    // Định dạng ngày khởi chiếu sang DD/MM/YYYY theo đúng chuẩn API CyberSoft
    const formattedDate = formatToDDMMYYYY(formData.ngayKhoiChieu);

    // Tạo biDanh độc nhất (đính kèm maPhim hoặc timestamp) để không bị đụng hàng biDanh với bất kỳ phim nào khác trên DB CyberSoft
    const slugBase = formData.tenPhim
      ? formData.tenPhim
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      : "movie";
    const biDanhStr = `${slugBase}-${isEditMode && selectedMovieForEdit ? selectedMovieForEdit.maPhim : Date.now()}`;

    if (isEditMode && selectedMovieForEdit) {
      formDataObj.append("maPhim", selectedMovieForEdit.maPhim);
    }
    formDataObj.append("tenPhim", formData.tenPhim.trim());
    formDataObj.append("biDanh", biDanhStr);
    formDataObj.append("trailer", formData.trailer || "");
    formDataObj.append("moTa", formData.moTa || "");
    formDataObj.append("ngayKhoiChieu", formattedDate);
    formDataObj.append("dangChieu", formData.dangChieu);
    formDataObj.append("sapChieu", formData.sapChieu);
    formDataObj.append("hot", formData.hot);
    formDataObj.append("danhGia", formData.danhGia || 10);
    formDataObj.append("maNhom", import.meta.env.VITE_MA_NHOM || "GP01");

    if (formData.fileImage) {
      // Làm sạch tên file và extension về dạng lowercase chuẩn (jpg, png, gif) để tránh CyberSoft API báo lỗi "Upload file không thành công!"
      const originalName = formData.fileImage.name || "poster.png";
      const rawExt = originalName.includes(".") ? originalName.split(".").pop().toLowerCase() : "png";
      const ext = rawExt === "jpeg" ? "jpg" : rawExt;
      const nameWithoutExt = originalName.includes(".")
        ? originalName.substring(0, originalName.lastIndexOf("."))
        : originalName;
      const cleanBase = nameWithoutExt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "_");
      const safeFileName = `${cleanBase}_${Date.now()}.${ext}`;

      const renamedFile = new File([formData.fileImage], safeFileName, {
        type: formData.fileImage.type || `image/${ext}`,
      });
      formDataObj.append("File", renamedFile, safeFileName);
    } else if (formData.hinhAnh) {
      // Khi không chọn file ảnh mới (chỉ sửa ngày chiếu/thông tin), chỉ gửi hinhAnh string cũ để CyberSoft API giữ nguyên poster
      formDataObj.append("hinhAnh", formData.hinhAnh);
    }

    if (isEditMode) {
      dispatch(actUpdateMovie(formDataObj));
    } else {
      dispatch(actAddMovie(formDataObj));
    }
  };

  /**
   * 6. Xử lý khi xác nhận Xóa Phim qua API
   */
  const handleConfirmDelete = (maPhim) => {
    dispatch(actDeleteMovie(maPhim));
  };

  /**
   * 7. Xử lý khi Submit Tạo Lịch Chiếu qua API
   */
  const handleShowtimeSubmitSuccess = (showtimeData) => {
    dispatch(actCreateShowtime(showtimeData));
    setToastMessage(`Đã gửi yêu cầu tạo lịch chiếu cho phim mã #${showtimeData.maPhim}`);
  };

  // Tính toán số liệu Dashboard
  const totalMovies = movies.length;
  const dangChieuCount = movies.filter((m) => m.dangChieu).length;
  const sapChieuCount = movies.filter((m) => m.sapChieu).length;
  const hotCount = movies.filter((m) => m.hot).length;

  return (
    <div className="space-y-6">
      {/* Thông báo Toast Thành công */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Alert Lỗi từ API nếu có */}
      {error && (
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">{typeof error === "string" ? error : "Lỗi kết nối máy chủ API CyberSoft"}</p>
        </div>
      )}

      {/* Header Trang Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Quản Lý Phim (Movie Management)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dữ liệu 100% kết nối thực tế với API CyberSoft Movie
          </p>
        </div>
      </div>

      {/* Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng Số Phim</p>
            <p className="text-xl font-bold text-slate-100">{totalMovies}</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Đang Chiếu</p>
            <p className="text-xl font-bold text-slate-100">{dangChieuCount}</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Sắp Chiếu</p>
            <p className="text-xl font-bold text-slate-100">{sapChieuCount}</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Phim Hot</p>
            <p className="text-xl font-bold text-slate-100">{hotCount}</p>
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Phim Component */}
      {loading ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-medium">Đang tải dữ liệu thực tế từ máy chủ API CyberSoft...</p>
        </div>
      ) : (
        <MovieListTable
          movies={movies}
          onAddMovie={handleOpenAddModal}
          onEditMovie={handleOpenEditModal}
          onDeleteMovie={handleOpenDeleteModal}
          onCreateShowtime={handleOpenShowtimeModal}
        />
      )}

      {/* Modal Popup Thêm / Sửa Phim */}
      <MovieFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedMovieForEdit}
        existingMovies={movies}
        onSubmitSuccess={handleFormSubmitSuccess}
      />

      {/* Modal Popup Xác Nhận Xóa Phim */}
      <DeleteMovieModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        movie={selectedMovieForDelete}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Modal Popup Tạo Lịch Chiếu */}
      <CreateShowtimeModal
        isOpen={isShowtimeModalOpen}
        onClose={() => setIsShowtimeModalOpen(false)}
        movie={selectedMovieForShowtime}
        onSubmitSuccess={handleShowtimeSubmitSuccess}
      />
    </div>
  );
}
