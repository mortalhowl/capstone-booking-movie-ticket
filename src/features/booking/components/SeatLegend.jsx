import { X } from "lucide-react";

export default function SeatLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-gray-100 text-sm font-medium text-gray-600">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gray-200 border border-gray-300"></div>{" "}
        Ghế thường
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-orange-400 border border-orange-500"></div>{" "}
        Ghế VIP
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-green-500 border border-green-600"></div>{" "}
        Đang chọn
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gray-400 flex items-center justify-center text-white opacity-60">
          <X className="w-4 h-4" />
        </div>
        Đã đặt
      </div>
    </div>
  );
}
