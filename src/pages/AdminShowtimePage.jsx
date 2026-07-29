import { Calendar, Plus } from "lucide-react";

export default function AdminShowtimePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Quản Lý Lịch Chiếu (Showtime Management)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Trang cấu hình xuất chiếu, chọn hệ thống rạp và đặt giá vé cho các phim
        </p>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-slate-200">Giao diện Tạo Lịch Chiếu</h3>
          <p className="text-xs text-slate-400 mt-1">
            Bạn có thể tạo trực tiếp lịch chiếu bằng cách chọn biểu tượng Lịch chiếu trên từng dòng phim tại trang <strong className="text-blue-400">Quản Lý Phim</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
