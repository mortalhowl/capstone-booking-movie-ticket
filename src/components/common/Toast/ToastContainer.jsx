import { ToastContainer as ReactToastContainer } from "react-toastify";

export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="top-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="colored"
      className="w-full sm:w-auto p-4 sm:p-0"
    />
  );
}
