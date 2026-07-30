import CinemaScheduleList from "@/features/cinema/components/CinemaScheduleList";
import { useMovieShowTime } from "@/features/cinema";

export default function HomePage() {
  const { showTime, loading, error } = useMovieShowTime();

  return (
    <div>
      <CinemaScheduleList
        movieSchedule={showTime}
        loading={loading}
        error={error}
      />
    </div>
  );
}
