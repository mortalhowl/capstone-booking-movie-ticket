import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchListUser,
  fetchUserTypes,
  actAddUser,
  actUpdateUser,
  actDeleteUser,
  actSearchUser,
  clearUserStatusMessage,
} from "@/features/admin/userSlice";
import {
  UserListTable,
  UserFormModal,
  DeleteUserModal,
} from "@/features/admin";
import { Users, ShieldAlert, UserCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminUserPage() {
  const dispatch = useDispatch();

  /**
   * Lấy dữ liệu thuần 100% từ Redux Store
   */
  const { loading, data: apiUsers, userTypes, error, successMessage } = useSelector(
    (state) => state.adminUser
  );

  const users = apiUsers && Array.isArray(apiUsers) ? apiUsers : [];

  // State điều khiển các Modal Popup
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

  // Thong bao Toast UI
  const [toastMessage, setToastMessage] = useState("");

  /**
   * useEffect: Gọi API lấy danh sách người dùng và loại người dùng
   */
  useEffect(() => {
    dispatch(fetchListUser());
    dispatch(fetchUserTypes());
  }, [dispatch]);

  /**
   * Hiển thị thông báo Toast khi có successMessage
   */
  useEffect(() => {
    if (successMessage) {
      setToastMessage(successMessage);
      const timer = setTimeout(() => {
        setToastMessage("");
        dispatch(clearUserStatusMessage());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  /**
   * Mở Modal Thêm Người Dùng
   */
  const handleOpenAddModal = () => {
    setSelectedUserForEdit(null);
    setIsFormModalOpen(true);
  };

  /**
   * Mở Modal Sửa Người Dùng
   */
  const handleOpenEditModal = (user) => {
    setSelectedUserForEdit(user);
    setIsFormModalOpen(true);
  };

  /**
   * Mở Modal Xóa Người Dùng
   */
  const handleOpenDeleteModal = (user) => {
    setSelectedUserForDelete(user);
    setIsDeleteModalOpen(true);
  };

  /**
   * Submit Form Thêm hoặc Sửa Người Dùng
   */
  const handleFormSubmitSuccess = (formData, isEditMode) => {
    if (isEditMode) {
      dispatch(actUpdateUser(formData));
    } else {
      dispatch(actAddUser(formData));
    }
  };

  /**
   * Xác nhận xóa người dùng
   */
  const handleConfirmDelete = (taiKhoan) => {
    dispatch(actDeleteUser(taiKhoan));
  };

  /**
   * Tìm kiếm người dùng
   */
  const handleSearch = (tuKhoa) => {
    dispatch(actSearchUser({ tuKhoa }));
  };

  // Thống kê số liệu người dùng
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.maLoaiNguoiDung === "QuanTri").length;
  const clientCount = users.filter((u) => u.maLoaiNguoiDung === "KhachHang").length;

  return (
    <div className="space-y-6">
      {/* Toast thông báo thành công */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Alert Lỗi từ API */}
      {error && (
        <div className="flex items-center space-x-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">
            {typeof error === "string" ? error : "Lỗi kết nối máy chủ API CyberSoft"}
          </p>
        </div>
      )}

      {/* Header Trang Admin User */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Quản Lý Người Dùng (User Management)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dữ liệu 100% kết nối thực tế với API CyberSoft User Management
          </p>
        </div>
      </div>

      {/* Thống Kê Tổng Quan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng Số Tài Khoản</p>
            <p className="text-xl font-bold text-slate-100">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Quản Trị Viên (Admin)</p>
            <p className="text-xl font-bold text-slate-100">{adminCount}</p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Khách Hàng (Client)</p>
            <p className="text-xl font-bold text-slate-100">{clientCount}</p>
          </div>
        </div>
      </div>

      {/* Bảng Danh Sách Người Dùng Component */}
      {loading ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-medium">Đang tải dữ liệu từ máy chủ API CyberSoft...</p>
        </div>
      ) : (
        <UserListTable
          users={users}
          onAddUser={handleOpenAddModal}
          onEditUser={handleOpenEditModal}
          onDeleteUser={handleOpenDeleteModal}
          onSearch={handleSearch}
        />
      )}

      {/* Modal Form Thêm / Sửa Người Dùng */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={selectedUserForEdit}
        userTypes={userTypes}
        onSubmitSuccess={handleFormSubmitSuccess}
      />

      {/* Modal Popup Xác Nhận Xóa */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUserForDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
