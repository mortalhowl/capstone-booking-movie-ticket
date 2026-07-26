import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../movieSlice";
import { useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";

export default function useMovies() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.movies);

  const fetchMovies = useCallback(
    (params = {}) => {
      dispatch(getMovies(params));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(getMovies({}));
    }
  }, [data, dispatch]);

  const upcomingMovies = useMemo(
    () =>
      data
        ?.filter((i) => i.sapChieu === true)
        ?.sort(
          (a, b) =>
            dayjs(a.ngayKhoiChieu).valueOf() - dayjs(b.ngayKhoiChieu).valueOf(),
        ) || [],
    [data],
  );

  const nowPlaying = useMemo(
    () =>
      data
        ?.filter((i) => i.dangChieu === true)
        ?.sort(
          (a, b) =>
            dayjs(b.ngayKhoiChieu).valueOf() - dayjs(a.ngayKhoiChieu).valueOf(),
        ) || [],
    [data],
  );

  return {
    upcomingMovies,
    nowPlaying,
    data,
    loading,
    error,
    fetchMovies,
  };
}
