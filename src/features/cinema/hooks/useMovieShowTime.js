import { useEffect, useParams } from "react";
import { getMovieShowTime } from "../cinemaSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useMovieShowTime() {
  const dispatch = useDispatch();
  const { maPhim } = useParams();
  const { showTime, loading, error } = useSelector((state) => state.cinema);

  useEffect(() => {
    if (!showTime || showTime.length === 0) dispatch(getMovieShowTime(maPhim));
  }, [dispatch, showTime, maPhim]);

  return {
    showTime,
    loading,
    error,
  };
}
