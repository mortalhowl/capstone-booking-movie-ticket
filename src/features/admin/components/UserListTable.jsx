import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function UserListTable({
  users = [],
  onAddUser,
  onEditUser,
  onDeleteUser,
  onSearch,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Khi danh sách người dùng thay đổi (ví dụ sau khi thêm mới), quay về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);

  // Xử lý tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Lọc theo Role
  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    return u.maLoaiNguoiDung === roleFilter;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Action Bar: Search, Filter, Add User */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tìm kiếm */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo họ tên hoặc tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-20 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg transition-colors"
          >
            Tìm
          </button>
        </form>

        {/* Lọc theo Loại & Nút Thêm Người Dùng */}
        <div className="flex items-center space-x-3">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 transition-colors"
          >
            <option value="ALL">Tất cả loại tài khoản</option>
            <option value="QuanTri">Quản Trị Viên (QuanTri)</option>
            <option value="KhachHang">Khách Hàng (KhachHang)</option>
          </select>

          <button
            onClick={onAddUser}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Người Dùng</span>
          </button>
        </div>
      </div>

      {/* Table Danh Sách Người Dùng */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-4">STT</th>
              <th className="px-5 py-4">Tài Khoản</th>
              <th className="px-5 py-4">Họ và Tên</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Số Điện Thoại</th>
              <th className="px-5 py-4 text-center">Loại Tài Khoản</th>
              <th className="px-5 py-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500">
                  Chưa có thông tin người dùng phù hợp.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => {
                const isAdmin = user.maLoaiNguoiDung === "QuanTri";
                return (
                  <tr
                    key={user.taiKhoan || index}
                    className="hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="px-5 py-4 text-xs font-mono text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    {/* Tai Khoan */}
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{user.taiKhoan}</span>
                      </div>
                    </td>

                    {/* Ho Ten */}
                    <td className="px-5 py-4 font-medium text-slate-100">
                      {user.hoTen}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-slate-300 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.email || "N/A"}</span>
                      </div>
                    </td>

                    {/* So Dien Thoai */}
                    <td className="px-5 py-4 text-slate-300 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.soDt || user.soDT || "N/A"}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-4 text-center">
                      {isAdmin ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Quản Trị Viên</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Khách Hàng</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEditUser(user)}
                        title="Chỉnh sửa thông tin"
                        className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
                        title="Xóa tài khoản"
                        className="p-2 rounded-lg bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <span className="text-xs text-slate-400">
          Hiển thị{" "}
          <strong className="text-slate-200">
            {currentUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          </strong>{" "}
          -{" "}
          <strong className="text-slate-200">
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
          </strong>{" "}
          trên tổng số <strong className="text-slate-200">{filteredUsers.length}</strong> tài khoản
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
