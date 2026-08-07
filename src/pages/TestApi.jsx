import { useBookingTicket } from "@/features/booking";
const body = {
  maLichChieu: 48337,
  danhSachVe: [
    {
      maGhe: 48843,
      giaVe: 150000,
    },
    {
      maGhe: 48844,
      giaVe: 150000,
    },
  ],
};
export default function TestApi() {
  const { handleBooking, loading, error } = useBookingTicket();

  return (
    <div>
      TestApi
      <button onClick={() => handleBooking(body)}>Book</button>
    </div>
  );
}
