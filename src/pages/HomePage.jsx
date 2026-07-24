import { toast } from "react-toastify";

export default function HomePage() {
  const noti = () => toast.error("Woww");
  return (
    <div>
      <button onClick={noti}>click me</button>
    </div>
  );
}
