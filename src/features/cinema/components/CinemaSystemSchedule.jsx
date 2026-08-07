import { useState, useMemo, useRef } from "react";
import Spinner from "@/components/common/Loading/Spinner";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { now } from "@/utils/formatDate";
import { scrollToTop } from "@/utils/scrollToTop";
import DateTabs from "./DateTabs";
import SystemSidebar from "./SystemSidebar";
import CinemaBranchList from "./CinemaBranchList";

export default function CinemaSystemSchedule({
  systemSchedule,
  loading,
  error,
}) {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const rightColumnRef = useRef(null);

  const dateTabs = useMemo(() => {
    const tabs = [];
    const today = now;
    const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

    for (let i = 0; i < 7; i++) {
      const d = today.add(i, "day");
      tabs.push({
        id: d.format("YYYY-MM-DD"),
        dayName: i === 0 ? "Hôm nay" : days[d.day()],
        dateStr: d.format("DD/MM"),
      });
    }
    return tabs;
  }, []);

  const activeSystem =
    selectedSystem ||
    (systemSchedule && systemSchedule.length > 0
      ? systemSchedule[0].maHeThongRap
      : null);

  const currentSystemData = systemSchedule?.find(
    (system) => system.maHeThongRap === activeSystem,
  );

  const danhSachCumRap = currentSystemData?.lstCumRap || [];

  const activeDate = selectedDate || dateTabs[0].id;

  const handleSelectSystem = (maHeThongRap) => {
    setSelectedSystem(maHeThongRap);
    setSelectedDate(null);
    scrollToTop(rightColumnRef.current);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    scrollToTop(rightColumnRef.current);
  };

  const filteredCumRap = danhSachCumRap
    .map((cumRap) => ({
      ...cumRap,
      danhSachPhim: cumRap.danhSachPhim
        ?.map((phim) => ({
          ...phim,
          lstLichChieuTheoPhim: phim.lstLichChieuTheoPhim?.filter((suat) => {
            if (!activeDate) return true;
            return (
              suat.ngayChieuGioChieu &&
              suat.ngayChieuGioChieu.startsWith(activeDate)
            );
          }),
        }))
        .filter(
          (phim) =>
            // phim.maPhim === 15526 &&
            phim.lstLichChieuTheoPhim && phim.lstLichChieuTheoPhim.length > 0,
        ),
    }))
    .filter((cumRap) => cumRap.danhSachPhim && cumRap.danhSachPhim.length > 0);

  if (loading)
    return (
      <Spinner
        size="lg"
        label="Đang tải..."
        className="h-[30vh] md:h-[50vh] lg:h-[70vh]"
      />
    );

  if (error) return <EmptyState message="Lỗi tải dữ liệu" />;

  if (!systemSchedule || systemSchedule.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        Cụm Rạp & Lịch Chiếu
      </h2>

      <DateTabs
        dateTabs={dateTabs}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      <div className="flex flex-col md:flex-row border border-gray-200 rounded-b-lg overflow-hidden bg-white shadow-sm">
        <SystemSidebar
          systemSchedule={systemSchedule}
          onSelectSystem={handleSelectSystem}
          activeSystem={activeSystem}
        />

        <div
          ref={rightColumnRef}
          className="flex-1 max-h-150 overflow-y-auto p-4 md:p-6 custom-scrollbar"
        >
          <CinemaBranchList
            filteredCumRap={filteredCumRap}
            currentSystemData={currentSystemData}
          />
        </div>
      </div>
    </div>
  );
}
