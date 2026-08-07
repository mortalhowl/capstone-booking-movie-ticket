import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onConfirmDelete,
}) {
  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirmDelete(user.taiKhoan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Modal Icon & Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Xác Nhận Xóa Người Dùng</h3>
            <p className="text-xs text-slate-400">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        {/* Content detail */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="text-xs text-slate-400">
            Tài khoản: <span className="font-bold text-slate-200">{user.taiKhoan}</span>
          </div>
          <div className="text-xs text-slate-400">
            Họ tên: <span className="font-bold text-slate-200">{user.hoTen}</span>
          </div>
          <div className="text-xs text-slate-400">
            Email: <span className="font-semibold text-slate-300">{user.email || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác Nhận Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
