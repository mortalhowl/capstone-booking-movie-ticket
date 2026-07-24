import { useSelector, useDispatch } from "react-redux";
import { getBanners } from "../bannerSlice";
import { useEffect } from "react";

export default function useBanner() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.banner);

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(getBanners());
    }
  }, []);

  return {
    data,
    loading,
    error,
  };
}
