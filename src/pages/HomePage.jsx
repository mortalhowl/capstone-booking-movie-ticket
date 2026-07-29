import { useMovieShowTime } from "@/features/cinema";

export default function HomePage() {
  const { showTime, loading, error } = useMovieShowTime();
  console.log(showTime);

  return <div>HomePage</div>;
}
