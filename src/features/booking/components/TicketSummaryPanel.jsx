import { Info } from "lucide-react";
import Button from "@/components/common/Button/Button";

export default function TicketSummaryPanel({
  movieInfo,
  selectedSeats,
  onTotalPrice,
  onBookTicket,
  loadingBooking,
}) {
  return (
    <div className="w-full lg:w-75 shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden flex flex-col h-full lg:h-auto">
        <div className="p-5 flex gap-4 border-b border-gray-100 bg-gray-50/50">
          <img
            src={movieInfo.hinhAnh}
            alt={movieInfo.tenPhim}
            className="w-20 h-28 object-cover rounded shadow-sm"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">
              {movieInfo.tenPhim}
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-1">
              {movieInfo.tenCumRap}
            </p>
            <p className="text-xs text-gray-500">
              {movieInfo.ngayChieu} - {movieInfo.gioChieu} - {movieInfo.tenRap}
            </p>
          </div>
        </div>

        <div className="p-5 flex-1 max-h-37 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700">Ghế đang chọn:</span>
            <span className="text-sm font-bold text-green-600">
              {selectedSeats.length} ghế
            </span>
          </div>
          {selectedSeats.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              Chưa có ghế nào được chọn.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((ghe) => (
                <span
                  key={ghe.maGhe}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold border border-green-200"
                >
                  {ghe.tenGhe}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-blue-50/50 border-t border-gray-100 flex items-start gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p>Vé sẽ được lưu trong lịch sử tài khoản của bạn.</p>
        </div>

        <div className="fixed bottom-0 left-0 w-full lg:static bg-white border-t border-gray-200 lg:border-none p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none z-40">
          <div className="flex justify-between items-center mb-4 lg:px-1">
            <span className="font-semibold text-gray-700 uppercase">
              Tổng tiền:
            </span>
            <span className="text-2xl font-bold text-red-600">
              {onTotalPrice.toLocaleString()} ₫
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full text-lg shadow-lg shadow-blue-600/30"
            onClick={onBookTicket}
            disabled={selectedSeats.length === 0}
            loading={loadingBooking}
          >
            ĐẶT VÉ
          </Button>
        </div>
      </div>
    </div>
  );
}
