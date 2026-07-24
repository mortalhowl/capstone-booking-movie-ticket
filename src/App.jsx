import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
