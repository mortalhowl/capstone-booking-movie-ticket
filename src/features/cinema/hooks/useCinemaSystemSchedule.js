import { useEffect } from "react";
import { getCinemaSystemSchedule } from "../cinemaSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useCinemaSystemSchedule() {
  const dispatch = useDispatch();
  const { systemSchedule, loading, error } = useSelector(
    (state) => state.cinema,
  );

  useEffect(() => {
    if (!systemSchedule || systemSchedule.length === 0)
      dispatch(getCinemaSystemSchedule({}));
  }, [dispatch, systemSchedule]);

  return {
    systemSchedule,
    loading,
    error,
  };
}
