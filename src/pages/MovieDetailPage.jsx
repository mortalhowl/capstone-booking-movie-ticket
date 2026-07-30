import useMovie from "@/features/movie/hooks/useMovie";
import { useMovieShowTime } from "@/features/cinema";
import MovieInfo from "@/features/movie/components/MovieInfo";
import CinemaScheduleList from "@/features/cinema/components/CinemaScheduleList";

export default function MovieDetailPage() {
  const { data, loading, error } = useMovie();
  const {
    showTime,
    loading: loadingShowTime,
    error: errorShowTime,
  } = useMovieShowTime();

  return (
    <div>
      <MovieInfo movie={data} loading={loading} error={error} />
      <CinemaScheduleList
        movieSchedule={showTime}
        loading={loadingShowTime}
        error={errorShowTime}
      />
    </div>
  );
}
