import { useSelector, useDispatch } from "react-redux";
import { searchMovies } from "../movieSlice";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function useSearchMovies() {
  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError } = useSelector(
    (state) => state.movies,
  );

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("search") || "";

  useEffect(() => {
    if (keyword) dispatch(searchMovies({ tenPhim: keyword }));
  }, [keyword, dispatch]);

  return {
    keyword,
    movies: searchResults || [],
    searchLoading,
    searchError,
  };
}
