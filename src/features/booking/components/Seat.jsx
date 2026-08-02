import { X } from "lucide-react";

export default function Seat({ selectedSeats, ghe, idx, onToggleSeat }) {
  const isSelected = selectedSeats.find((s) => s.maGhe === ghe.maGhe);

  let seatClass = "bg-gray-200 border-gray-300 text-gray-600 hover:bg-gray-300";
  if (ghe.loaiGhe === "Vip")
    seatClass =
      "bg-orange-100 border-orange-300 text-orange-600 hover:bg-orange-200";
  if (isSelected)
    seatClass =
      "bg-green-500 border-green-600 text-white shadow-md transform scale-110";
  if (ghe.daDat)
    seatClass =
      "bg-gray-300 border-gray-300 text-white cursor-not-allowed opacity-60";

  return (
    <button
      key={ghe.maGhe}
      onClick={() => onToggleSeat(ghe)}
      disabled={ghe.daDat}
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm border-b-4 transition-all duration-200 flex items-center justify-center text-xs font-semibold ${seatClass} ${idx === 1 || idx === 13 ? "mr-6 sm:mr-8" : ""}`}
      title={`${ghe.tenGhe} - ${ghe.giaVe.toLocaleString()}đ`}
    >
      {ghe.daDat ? <X className="w-5 h-5 text-gray-500" /> : ghe.tenGhe}
    </button>
  );
}
