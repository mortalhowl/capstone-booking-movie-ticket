import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../movieSlice";
import { useCallback, useEffect, useMemo } from "react";

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
    () => data?.filter((i) => i.sapChieu === true) || [],
    [data],
  );

  const nowPlaying = useMemo(
    () => data?.filter((i) => i.dangChieu === true) || [],
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
