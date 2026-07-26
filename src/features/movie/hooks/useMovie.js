import { useSelector, useDispatch } from "react-redux";
import { getMovieDetail } from "../movieSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function useMovie() {
  const dispatch = useDispatch();
  const { maPhim } = useParams();

  const { movieDetail, movieDetailLoading, movieDetailError } = useSelector(
    (state) => state.movies,
  );

  useEffect(() => {
    dispatch(getMovieDetail({ maPhim: maPhim }));
  }, [maPhim, dispatch]);

  return {
    data: movieDetail || {},
    loading: movieDetailLoading,
    error: movieDetailError,
  };
}
