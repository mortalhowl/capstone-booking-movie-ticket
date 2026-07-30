import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieShowTime } from "../cinemaSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useMovieShowTime() {
  const dispatch = useDispatch();
  const { maPhim } = useParams();
  const { showTime, loading, error } = useSelector((state) => state.cinema);

  useEffect(() => {
    dispatch(getMovieShowTime(maPhim));
  }, [dispatch, maPhim]);

  return {
    showTime,
    loading,
    error,
  };
}
