// import { useState, useMemo, useRef } from "react";
// import { Link } from "react-router-dom";
// import { Clock } from "lucide-react";
// import { useCinema } from "@/features/cinema";
// import Spinner from "@/components/common/Loading/Spinner";
// import EmptyState from "@/components/common/EmptyState/EmptyState";
// import { formatDate, now } from "@/utils/formatDate";
// import { scrollToTop } from "@/utils/scrollToTop";

// export default function TestApi() {
//   const { data, loading, error } = useCinema();
//   const [selectedSystem, setSelectedSystem] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);

//   const rightColumnRef = useRef(null);

//   const dateTabs = useMemo(() => {
//     const tabs = [];
//     const today = now;
//     const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

//     for (let i = 0; i < 7; i++) {
//       const d = today.add(i, "day");
//       tabs.push({
//         id: d.format("YYYY-MM-DD"),
//         dayName: i === 0 ? "Hôm nay" : days[d.day()],
//         dateStr: d.format("DD/MM"),
//       });
//     }
//     return tabs;
//   }, []);

//   const activeSystem =
//     selectedSystem || (data && data.length > 0 ? data[0].maHeThongRap : null);

//   const currentSystemData = data?.find(
//     (system) => system.maHeThongRap === activeSystem,
//   );

//   const danhSachCumRap = currentSystemData?.lstCumRap || [];

//   const activeDate = selectedDate || dateTabs[0].id;

//   const handleSelectSystem = (maHeThongRap) => {
//     setSelectedSystem(maHeThongRap);
//     setSelectedDate(null);
//     scrollToTop(rightColumnRef.current);
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date);
//     scrollToTop(rightColumnRef.current);
//   };

//   const filteredCumRap = danhSachCumRap
//     .map((cumRap) => ({
//       ...cumRap,
//       danhSachPhim: cumRap.danhSachPhim
//         ?.map((phim) => ({
//           ...phim,
//           lstLichChieuTheoPhim: phim.lstLichChieuTheoPhim?.filter((suat) => {
//             if (!activeDate) return true;
//             return (
//               suat.ngayChieuGioChieu &&
//               suat.ngayChieuGioChieu.startsWith(activeDate)
//             );
//           }),
//         }))
//         .filter(
//           (phim) =>
//             // phim.maPhim === 15526 &&
//             phim.lstLichChieuTheoPhim && phim.lstLichChieuTheoPhim.length > 0,
//         ),
//     }))
//     .filter((cumRap) => cumRap.danhSachPhim && cumRap.danhSachPhim.length > 0);

//   if (loading)
//     return (
//       <Spinner
//         size="lg"
//         label="Đang tải..."
//         className="h-[30vh] md:h-[50vh] lg:h-[70vh]"
//       />
//     );

//   if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

//   if (!data || data.length === 0) return null;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
//         Cụm Rạp & Lịch Chiếu
//       </h2>

//       {/* <div className=" border-x border-t border-gray-200 rounded-t-lg shadow-md">
//         <div className="flex overflow-x-auto no-scrollbar p-2 gap-2">
//           {dateTabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => handleSelectDate(tab.id)}
//               className={`flex flex-col items-center justify-center min-w-20 p-3 rounded-lg transition-all ${
//                 activeDate === tab.id
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <span
//                 className={`text-xs font-medium mb-1 ${activeDate === tab.id ? "text-blue-100" : "text-gray-500"}`}
//               >
//                 {tab.dayName}
//               </span>
//               <span className="text-lg font-bold">{tab.dateStr}</span>
//             </button>
//           ))}
//         </div>
//       </div> */}

//       <div className="flex flex-col md:flex-row border border-gray-200 rounded-b-lg overflow-hidden bg-white shadow-sm">
//         <div className="w-full md:w-24 lg:w-32 flex md:flex-col overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
//           {data.map((system) => (
//             <button
//               key={system.maHeThongRap}
//               onClick={() => handleSelectSystem(system.maHeThongRap)}
//               className={`p-4 flex justify-center items-center shrink-0 transition-colors ${
//                 activeSystem === system.maHeThongRap
//                   ? "bg-white border-b-2 md:border-b-0 md:border-r-4 border-blue-600 opacity-100"
//                   : "opacity-50 hover:opacity-100"
//               }`}
//             >
//               <img
//                 src={system.logo}
//                 alt={system.tenHeThongRap}
//                 className="w-12 h-12 rounded-full border border-gray-200"
//               />
//             </button>
//           ))}
//         </div>

//         <div
//           ref={rightColumnRef}
//           className="flex-1 max-h-150 overflow-y-auto p-4 md:p-6 custom-scrollbar"
//         >
//           {filteredCumRap.length === 0 ? (
//             <div className="text-center py-10 text-gray-400">
//               Hiện tại hệ thống rạp này không có suất chiếu trong ngày này.
//             </div>
//           ) : (
//             filteredCumRap.map((cumRap) => (
//               <div
//                 key={cumRap.maCumRap}
//                 className="mb-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0"
//               >
//                 <div className="flex gap-4 items-start mb-4">
//                   <img
//                     src={currentSystemData?.logo}
//                     alt="Logo"
//                     className="w-12 h-12 rounded mt-1 object-cover"
//                   />
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-lg">
//                       {cumRap.tenCumRap}
//                     </h3>
//                     <p className="text-gray-500 text-sm">{cumRap.diaChi}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4 pl-0 md:pl-16">
//                   {cumRap.danhSachPhim?.map((phim) => (
//                     <div
//                       key={phim.maPhim}
//                       className="bg-gray-50/50 p-3 rounded-md"
//                     >
//                       <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                         <span className="text-blue-600">•</span> {phim.tenPhim}
//                       </h4>

//                       <div className="flex flex-wrap gap-3">
//                         {phim.lstLichChieuTheoPhim?.map((suatChieu) => (
//                           <Link
//                             key={suatChieu.maLichChieu}
//                             to={`/booking/${suatChieu.maLichChieu}`}
//                             className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white flex items-center gap-1.5"
//                           >
//                             <Clock className="w-4 h-4 text-gray-400" />
//                             <span className="text-green-600 font-bold">
//                               {formatDate(
//                                 suatChieu.ngayChieuGioChieu,
//                                 "timeShort",
//                               )}
//                             </span>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function TestApi() {
  return <div>TestApi</div>;
}
