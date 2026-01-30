import { useEffect, useState } from "react";
import FleetOverviewCards from "../components/fleet/FleetOverviewCards";
import DeviceList from "../components/device/DeviceList";
import DeviceDetailsPane from "../components/device/DeviceDetailsPane";
import { fetchOverview } from "../api/dashboard";

export type HealthFilter =
  | "ACTIVE"
  | "WATCH"
  | "DEGRADED"
  | "CRITICAL"
  | "UNKNOWN"
  | "DECOMMISSIONED"
  | "REGISTERED"
  | null;

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [selectedHealth, setSelectedHealth] = useState<HealthFilter>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  async function loadOverview() {
    const data = await fetchOverview();
    setOverview(data);
  }

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    setSelectedDeviceId(null);
  }, [selectedHealth]);

  if (!overview) return null;

  return (
    <div className="h-screen w-screen bg-[#111827] text-[#f9fafb] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#374151]">
        <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
          className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm"
        >
          Logout
        </button>
      </header>

      {/* Overview */}
      <div className="px-6 py-4">
        <FleetOverviewCards
          data={overview}
          selected={selectedHealth}
          onSelect={setSelectedHealth}
          onReload={loadOverview}
        />
      </div>

      {/* Main Content */}
      <section className="flex flex-1 overflow-hidden px-6 pb-6 gap-4">
        {/* Device List */}
        <div
          className={`
        transition-all duration-300 ease-in-out overflow-auto
        ${selectedDeviceId ? "w-1/2" : "w-full"}
      `}
        >
          <DeviceList
            healthFilter={selectedHealth}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
          />
        </div>

        {/* Device Details */}
        {selectedDeviceId && (
          <div className="w-1/2 h-full overflow-auto">
            <DeviceDetailsPane deviceId={selectedDeviceId} />
          </div>
        )}
      </section>
    </div>
  );
}
