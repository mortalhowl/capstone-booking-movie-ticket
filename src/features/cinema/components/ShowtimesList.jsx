import { Clock } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";

export default function ShowtimesList({ phim }) {
  return (
    <div className="flex flex-wrap gap-3">
      {phim.lstLichChieuTheoPhim?.map((suatChieu) => (
        <Link
          key={suatChieu.maLichChieu}
          to={`/booking/${suatChieu.maLichChieu}`}
          className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white flex items-center gap-1.5"
        >
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-green-600 font-bold">
            {formatDate(suatChieu.ngayChieuGioChieu, "timeShort")}
          </span>
        </Link>
      ))}
    </div>
  );
}
