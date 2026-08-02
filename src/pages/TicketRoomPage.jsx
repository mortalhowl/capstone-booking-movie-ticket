import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SeatMap } from "@/features/booking";
import { useTicketRoom, useBookingTicket } from "@/features/booking";
import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import TicketSummaryPanel from "@/features/booking/components/TicketSummaryPanel";
import { toast } from "react-toastify";

export default function TicketRoomPage() {
  const { maLichChieu } = useParams();
  const { data, loading, error, refetch } = useTicketRoom();
  const { handleBooking, loading: loadingBooking } = useBookingTicket();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  console.log(selectedSeats);

  const handleToggleSeat = (ghe) => {
    if (ghe.daDat) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((item) => item.maGhe === ghe.maGhe);
      if (isSelected) {
        return prev.filter((item) => item.maGhe !== ghe.maGhe);
      } else {
        return [
          ...prev,
          {
            tenGhe: ghe.tenGhe,
            maGhe: ghe.maGhe,
            giaVe: ghe.giaVe,
          },
        ];
      }
    });
  };

  const handleBookTicket = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }
    try {
      await handleBooking({
        maLichChieu: maLichChieu,
        danhSachVe: selectedSeats.map(({ tenGhe, ...rest }) => rest),
      });
      if (refetch) refetch();
      setSelectedSeats([]);
      // setTimeout(() => {
      //   navigate("/profile");
      // }, 1500);
    } catch (error) {
      toast.error(error);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, ghe) => sum + ghe.giaVe, 0);

  if (loading)
    return <Spinner size="lg" className="h-[30vh] md:h-[50vh] lg:h-[70vh]" />;

  if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Trở lại
        </button>

        <div className="flex flex-col lg:flex-row gap-5 items-start w-full min-w-0">
          <div className="flex-1 w-full min-w-0">
            <SeatMap
              danhSachGhe={data?.danhSachGhe || []}
              onToggleSeat={handleToggleSeat}
              selectedSeats={selectedSeats}
            />
          </div>
          <TicketSummaryPanel
            movieInfo={data?.thongTinPhim || {}}
            selectedSeats={selectedSeats}
            onTotalPrice={totalPrice}
            onBookTicket={handleBookTicket}
            loadingBooking={loadingBooking}
          />
        </div>
      </div>
    </div>
  );
}
