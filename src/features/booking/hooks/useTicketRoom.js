import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTicketRoom } from "../bookingSlice";
import { useEffect } from "react";

export default function useTicketRoom() {
  const { maLichChieu } = useParams();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getTicketRoom(maLichChieu));
  }, [dispatch, maLichChieu]);

  const refetch = () => {
    dispatch(getTicketRoom(maLichChieu));
  };
  return {
    data,
    loading,
    error,
    refetch,
  };
}
