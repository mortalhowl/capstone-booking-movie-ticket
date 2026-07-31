import { useDispatch, useSelector } from "react-redux";
import { postBookingTicket } from "../bookingSlice";
import { toast } from "react-toastify";

export default function useTicketRoom() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.booking);

  const handleBooking = async (body) => {
    try {
      await dispatch(postBookingTicket(body)).unwrap();
      toast.success("Đặt vé thành công");
    } catch (error) {
      toast.error("Đặt vé thất bại");
      console.log(error);
    }
  };

  return {
    handleBooking,
    loading,
    error,
  };
}
