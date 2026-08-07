export default function SystemSidebar({
  systemSchedule,
  onSelectSystem,
  activeSystem,
}) {
  return (
    <div className="w-full md:w-24 lg:w-32 flex md:flex-col overflow-x-auto no-scrollbar border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
      {systemSchedule.map((system) => (
        <button
          key={system.maHeThongRap}
          onClick={() => onSelectSystem(system.maHeThongRap)}
          className={`p-4 flex justify-center items-center shrink-0 transition-colors ${
            activeSystem === system.maHeThongRap
              ? "bg-white border-b-2 md:border-b-0 md:border-r-4 border-blue-600 opacity-100"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <img
            src={system.logo}
            alt={system.tenHeThongRap}
            className="w-12 h-12 rounded-full border border-gray-200"
          />
        </button>
      ))}
    </div>
  );
}
