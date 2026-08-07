import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export default function DetailBranchList({
  filteredCumRap,
  currentSystemData,
}) {
  return (
    <>
      {filteredCumRap.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          Hiện tại hệ thống rạp này không có suất chiếu trong ngày này.
        </div>
      ) : (
        filteredCumRap.map((cumRap) => (
          <div
            key={cumRap.maCumRap}
            className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0"
          >
            <div className="flex gap-4 items-start mb-4">
              <img
                src={cumRap.hinhAnh || currentSystemData?.logo}
                alt="Logo"
                className="w-12 h-12 rounded mt-1 object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {cumRap.tenCumRap}
                </h3>
                <p className="text-gray-500 text-sm">{cumRap.diaChi}</p>
              </div>
            </div>

            <div className="pl-0 md:pl-16 mt-2">
              <div className="flex flex-wrap gap-3">
                {cumRap.lichChieuPhim?.map((suat) => (
                  <Link
                    key={suat.maLichChieu}
                    to={`/booking/${suat.maLichChieu}`}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-green-600 font-bold">
                      {formatDate(suat.ngayChieuGioChieu, "timeShort")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
