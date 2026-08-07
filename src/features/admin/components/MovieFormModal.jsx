import { useState, useEffect } from "react";
import { X, Upload, Film, Star, Flame, Calendar, Link as LinkIcon, Check } from "lucide-react";
import dayjs from "dayjs";

export default function MovieFormModal({
  isOpen,
  onClose,
  initialData = null, // null for Add mode, movie object for Edit mode
  onSubmitSuccess,
}) {
  const isEditMode = Boolean(initialData && initialData.maPhim);

  const [formData, setFormData] = useState({
    tenPhim: "",
    trailer: "",
    moTa: "",
    ngayKhoiChieu: "",
    dangChieu: true,
    sapChieu: false,
    hot: false,
    danhGia: 8,
    hinhAnh: "",
    fileImage: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  // Sync initialData khi Edit hoặc Reset khi Thêm mới
  useEffect(() => {
    if (initialData) {
      // Chuyển đổi ngày về dạng YYYY-MM-DD để thẻ <input type="date"> hiển thị chuẩn
      let formattedDateStr = "";
      if (initialData.ngayKhoiChieu) {
        const parsed = dayjs(initialData.ngayKhoiChieu);
        if (parsed.isValid()) {
          formattedDateStr = parsed.format("YYYY-MM-DD");
        }
      }

      setFormData({
        tenPhim: initialData.tenPhim || "",
        trailer: initialData.trailer || "",
        moTa: initialData.moTa || "",
        ngayKhoiChieu: formattedDateStr,
        dangChieu: initialData.dangChieu ?? true,
        sapChieu: initialData.sapChieu ?? false,
        hot: initialData.hot ?? false,
        danhGia: initialData.danhGia || 8,
        hinhAnh: initialData.hinhAnh || "",
        fileImage: null,
      });
      setPreviewImage(initialData.hinhAnh || "");
    } else {
      // Reset form cho chế độ Thêm phim (Mặc định lấy ngày hôm nay)
      setFormData({
        tenPhim: "",
        trailer: "",
        moTa: "",
        ngayKhoiChieu: dayjs().format("YYYY-MM-DD"),
        dangChieu: true,
        sapChieu: false,
        hot: false,
        danhGia: 8,
        hinhAnh: "",
        fileImage: null,
      });
      setPreviewImage("");
    }
  }, [initialData, isOpen]);

  const minDateStr = dayjs().format("YYYY-MM-DD");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    // Không cho phép chọn ngày khởi chiếu ở quá khứ
    if (name === "ngayKhoiChieu" && value) {
      if (dayjs(value).isBefore(dayjs(), "day")) {
        finalValue = minDateStr;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitSuccess) {
      onSubmitSuccess(formData, isEditMode);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 transform transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {isEditMode ? `Cập Nhật Phim (Mã: #${initialData.maPhim})` : "Thêm Phim Mới vào Hệ Thống"}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? "Điều chỉnh thông tin phim và hình ảnh poster"
                  : "Điền đầy đủ thông tin chi tiết của phim mới"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Left Side (Inputs) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tên phim */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tên Phim <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenPhim"
                  required
                  placeholder="Nhập tên phim..."
                  value={formData.tenPhim}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Trailer Youtube Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Trailer Link (Youtube URL)</span>
                </label>
                <input
                  type="text"
                  name="trailer"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.trailer}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Grid 2 cols for Date & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ngày khởi chiếu */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ngày Khởi Chiếu</span>
                  </label>
                  <input
                    type="date"
                    name="ngayKhoiChieu"
                    min={minDateStr}
                    value={formData.ngayKhoiChieu}
                    onChange={handleChange}
                    onKeyDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      if (e.target.showPicker) {
                        try {
                          e.target.showPicker();
                        } catch (err) {
                          // Ignore error if picker cannot be opened
                        }
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark] cursor-pointer"
                  />
                </div>

                {/* Đánh giá */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Đánh Giá (1 - 10)</span>
                    </span>
                    <span className="text-amber-400 font-bold">{formData.danhGia}/10</span>
                  </label>
                  <input
                    type="range"
                    name="danhGia"
                    min="1"
                    max="10"
                    value={formData.danhGia}
                    onChange={handleChange}
                    className="w-full h-2 bg-slate-950 border border-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                  />
                </div>
              </div>

              {/* Status Switches (Đang chiếu, Sắp chiếu, Hot) */}
              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Trạng Thái & Phân Loại
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* Đang chiếu */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="dangChieu"
                      checked={formData.dangChieu}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-300">Đang Chiếu</span>
                  </label>

                  {/* Sắp chiếu */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="sapChieu"
                      checked={formData.sapChieu}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-300">Sắp Chiếu</span>
                  </label>

                  {/* Hot */}
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="hot"
                      checked={formData.hot}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-amber-400 flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Hot</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mô Tả Phim
                </label>
                <textarea
                  name="moTa"
                  rows="4"
                  placeholder="Nhập nội dung mô tả vắn tắt của bộ phim..."
                  value={formData.moTa}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Right Side (Poster File Upload & Preview) */}
            <div className="flex flex-col space-y-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Hình Ảnh Poster Phim
              </label>

              {/* Preview Box */}
              <div className="flex-1 min-h-[260px] bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Poster preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-lg">
                        Đổi hình ảnh
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer text-center space-y-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        Bấm để tải hình ảnh lên
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Hỗ trợ PNG, JPG, WEBP (Tối đa 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Direct Image URL fallback */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Hoặc dán URL hình ảnh trực tiếp:</label>
                <input
                  type="text"
                  name="hinhAnh"
                  placeholder="https://domain.com/image.jpg"
                  value={formData.hinhAnh}
                  onChange={(e) => {
                    handleChange(e);
                    setPreviewImage(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium text-sm transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? "Lưu Thay Đổi" : "Tạo Phim Mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
