import { logoutUser } from "@/features/auth";
import { useDispatch } from "react-redux";
export default function HomePage() {
  const dispatch = useDispatch();
  return (
    <div>
      HomePage
      <button onClick={() => dispatch(logoutUser())}>logout</button>
    </div>
  );
}
