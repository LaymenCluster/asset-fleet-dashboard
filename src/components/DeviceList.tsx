import { useEffect, useState } from "react";
import { fetchDevices } from "../api/dashboard";
import type { HealthFilter } from "../pages/Dashboard";

type Device = {
  device_id: string;
  name: string;
  model: string;
  health_state: string;
  is_offline: boolean;
  last_seen: number;
};

type Props = {
  healthFilter: HealthFilter;
  onSelectDevice: (id: string) => void;
  selectedDeviceId: string | null;
};

export default function DeviceList({
  healthFilter,
  onSelectDevice,
  selectedDeviceId,
}: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDevices(cursor?: string) {
    setLoading(true);
    try {
      const res = await fetchDevices(
        healthFilter ?? undefined,
        "score",
        cursor,
      );
      setDevices(res.items);
      setNextCursor(
        res.next_cursor && res.next_cursor !== "None" ? res.next_cursor : null,
      );
    } finally {
      setLoading(false);
    }
  }

  // first load or refresh
  function refresh() {
    loadDevices();
  }

  useEffect(() => {
    refresh();
  }, [healthFilter]);

  return (
    <section className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">
        Devices {healthFilter ? `(${healthFilter})` : ""}
      </h2>

      <div className="flex-1 overflow-auto space-y-2">
        {devices.map((d) => (
          <div
            key={d.device_id}
            onClick={() => onSelectDevice(d.device_id)}
            className={`
              p-3 rounded cursor-pointer flex justify-between items-center
              transition-colors duration-200
              ${
                selectedDeviceId === d.device_id
                  ? "bg-[#374151]"
                  : "bg-[#1f2937] hover:bg-[#374151]"
              }
            `}
          >
            <div>
              <div className="font-medium">{d.name}</div>
              <div className="text-sm text-gray-400">{d.model}</div>
              <div
                className={`text-xs mt-1 ${
                  d.is_offline ? "text-red-400" : "text-gray-400"
                }`}
              >
                Last seen: {formatLastSeen(d.last_seen)}
              </div>
            </div>

            <div className="text-sm font-medium">{d.health_state}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {!nextCursor ? (
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        ) : (
          <>
            <button
              onClick={() => loadDevices()}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => nextCursor && loadDevices(nextCursor)}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
            >
              Next
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function formatLastSeen(epochSeconds: number) {
  const diffMs = Date.now() - epochSeconds * 1000;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} hr ago`;
}
