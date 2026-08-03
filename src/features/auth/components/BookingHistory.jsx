import { Clock, MapPin, Ticket, Calendar, DollarSign } from "lucide-react";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { formatDate } from "@/utils/formatDate";

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return amount;
  return amount.toLocaleString("vi-VN") + " VNĐ";
};

export default function BookingHistory({ thongTinDatVe = [] }) {
  if (!thongTinDatVe || thongTinDatVe.length === 0) {
    return <EmptyState message="Bạn chưa có lịch sử đặt vé nào." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">
          Lịch sử đặt vé ({thongTinDatVe.length})
        </h2>
      </div>

      {thongTinDatVe.map((ticket, index) => {
        const danhSachGhe = ticket.danhSachGhe || [];
        const rapInfo = danhSachGhe[0] || {};
        const tenHeThong = rapInfo.tenHeThongRap || rapInfo.tenHethongRap || "";
        const tenCumRap = rapInfo.tenCumRap || "";
        const dsGheStr = danhSachGhe.map((g) => g.tenGhe).join(", ");

        return (
          <div
            key={ticket.maVe || index}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow"
          >
            <div className="w-full sm:w-36 md:w-44 h-48 sm:h-auto shrink-0 bg-gray-100 relative overflow-hidden">
              <img
                src={ticket.hinhAnh}
                alt={ticket.tenPhim}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {ticket.tenPhim?.trim()}
                  </h3>
                  <span className="shrink-0 text-xs px-2.5 py-1 bg-blue-50 text-blue-600 font-semibold rounded-full border border-blue-100">
                    #{ticket.maVe}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mt-2">
                  {ticket.thoiLuongPhim && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {ticket.thoiLuongPhim} phút
                    </span>
                  )}
                  {ticket.giaVe != null && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      {formatCurrency(ticket.giaVe)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 bg-gray-50 p-3.5 rounded-lg border border-gray-100 text-sm">
                {(tenHeThong || tenCumRap) && (
                  <p className="font-medium text-gray-800 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      {tenHeThong && (
                        <strong className="text-blue-700">
                          {tenHeThong} -{" "}
                        </strong>
                      )}
                      {tenCumRap}
                    </span>
                  </p>
                )}
                {dsGheStr && (
                  <p className="font-medium text-gray-800 flex items-start gap-2">
                    <Ticket className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      Ghế đã đặt:{" "}
                      <strong className="text-emerald-600 font-bold">
                        {dsGheStr}
                      </strong>
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end text-xs text-gray-400 gap-1.5 pt-1 border-t border-gray-50">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Ngày đặt: {formatDate(ticket.ngayDat, "datetimeShort")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
