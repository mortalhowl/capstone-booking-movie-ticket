import { useState, useEffect } from "react";
import { X, User, Lock, Mail, Phone, Shield, Eye, EyeOff, Save } from "lucide-react";

export default function UserFormModal({
  isOpen,
  onClose,
  initialData = null,
  userTypes = [],
  onSubmitSuccess,
}) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    hoTen: "",
    email: "",
    soDt: "",
    maLoaiNguoiDung: "KhachHang",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        taiKhoan: initialData.taiKhoan || "",
        matKhau: initialData.matKhau || "",
        hoTen: initialData.hoTen || "",
        email: initialData.email || "",
        soDt: initialData.soDt || initialData.soDT || "",
        maLoaiNguoiDung: initialData.maLoaiNguoiDung || "KhachHang",
      });
    } else {
      setFormData({
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
        maLoaiNguoiDung: "KhachHang",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taiKhoan.trim()) newErrors.taiKhoan = "Vui lòng nhập tài khoản";
    if (!formData.matKhau.trim()) newErrors.matKhau = "Vui lòng nhập mật khẩu";
    if (!formData.hoTen.trim()) newErrors.hoTen = "Vui lòng nhập họ và tên";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.soDt.trim()) newErrors.soDt = "Vui lòng nhập số điện thoại";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmitSuccess(formData, isEditMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">
                {isEditMode ? "Cập Nhật Thông Tin Người Dùng" : "Thêm Người Dùng Mới"}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditMode
                  ? `Chỉnh sửa thông tin tài khoản #${formData.taiKhoan}`
                  : "Tạo tài khoản mới kết nối hệ thống CyberSoft"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Tai Khoan */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tài Khoản <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="taiKhoan"
                disabled={isEditMode}
                value={formData.taiKhoan}
                onChange={handleChange}
                placeholder="Nhập tên tài khoản..."
                className={`w-full bg-slate-950 border ${
                  errors.taiKhoan ? "border-rose-500" : "border-slate-800"
                } ${
                  isEditMode ? "opacity-60 cursor-not-allowed" : "focus:border-blue-500"
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors`}
              />
            </div>
            {errors.taiKhoan && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.taiKhoan}</p>
            )}
          </div>

          {/* Mat Khau */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mật Khẩu <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="matKhau"
                value={formData.matKhau}
                onChange={handleChange}
                placeholder="Nhập mật khẩu..."
                className={`w-full bg-slate-950 border ${
                  errors.matKhau ? "border-rose-500" : "border-slate-800"
                } focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.matKhau && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.matKhau}</p>
            )}
          </div>

          {/* Ho Ten */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Họ và Tên <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ..."
              className={`w-full bg-slate-950 border ${
                errors.hoTen ? "border-rose-500" : "border-slate-800"
              } focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors`}
            />
            {errors.hoTen && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.hoTen}</p>
            )}
          </div>

          {/* Grid Email & So Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@cybersoft.vn"
                  className={`w-full bg-slate-950 border ${
                    errors.email ? "border-rose-500" : "border-slate-800"
                  } focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Số Điện Thoại <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="soDt"
                  value={formData.soDt}
                  onChange={handleChange}
                  placeholder="0901234567"
                  className={`w-full bg-slate-950 border ${
                    errors.soDt ? "border-rose-500" : "border-slate-800"
                  } focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors`}
                />
              </div>
              {errors.soDt && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.soDt}</p>
              )}
            </div>
          </div>

          {/* Loai Nguoi Dung Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Loại Tài Khoản <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                name="maLoaiNguoiDung"
                value={formData.maLoaiNguoiDung}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 outline-none transition-colors"
              >
                {userTypes && userTypes.length > 0 ? (
                  userTypes.map((type) => (
                    <option key={type.maLoaiNguoiDung} value={type.maLoaiNguoiDung}>
                      {type.tenLoai} ({type.maLoaiNguoiDung})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="KhachHang">Khách Hàng (KhachHang)</option>
                    <option value="QuanTri">Quản Trị Viên (QuanTri)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? "Lưu Thay Đổi" : "Thêm Người Dùng"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
