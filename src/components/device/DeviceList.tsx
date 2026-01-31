import { useEffect, useState } from "react";
import { fetchDevices } from "../../api/dashboard";
import { RegisterDeviceModal } from "../device/RegisterDeviceModal";
import { DeviceItem } from "./DeviceItem";
import { PaginationControls } from "./PaginationControls";
import { CONFIG } from "../../config";
import type { HealthFilter } from "../../pages/Dashboard";
import { isAdmin } from "../../api/auth";

type Device = {
  device_id: string;
  name: string;
  model: string;
  health_state: string;
  lifecycle_state: string;
  is_offline: boolean;
  last_seen: number;
};

type Props = {
  healthFilter: HealthFilter;
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
};

export default function DeviceList({
  healthFilter,
  selectedDeviceId,
  onSelectDevice,
}: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const loadPage = async (cursor: string | null, index: number) => {
    setLoading(true);
    try {
      const res = await fetchDevices(
        healthFilter ?? undefined,
        "score",
        cursor ?? undefined,
      );

      setDevices(res.items);
      setNextCursor(res.next_cursor ?? null);
      setCurrentIndex(index);

      setCursorHistory((prev) => {
        const copy = prev.slice(0, index + 1);
        copy[index] = cursor;
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const reload = () => {
    setCursorHistory([null]);
    setCurrentIndex(0);
    loadPage(null, 0);
  };

  useEffect(() => {
    reload();
  }, [healthFilter]);

  const canGoNext = devices.length === CONFIG.PAGE_SIZE && nextCursor !== null;

  const canGoPrev = currentIndex > 0;

  return (
    <section className="flex flex-col h-full">
      <header className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          Devices {healthFilter && `(${healthFilter})`}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={reload}
            disabled={loading}
            className="px-3 py-1 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
          >
            Reload
          </button>

          {isAdmin() && (
            <button
              onClick={() => setShowRegister(true)}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
            >
              + Register Device
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto space-y-2">
        {devices.map((d) => (
          <DeviceItem
            key={d.device_id}
            device={d}
            selected={selectedDeviceId === d.device_id}
            onSelect={onSelectDevice}
          />
        ))}
      </div>

      <PaginationControls
        loading={loading}
        showNext={canGoNext}
        showPrev={canGoPrev}
        onNext={() => {
          if (!nextCursor) return;
          loadPage(nextCursor, currentIndex + 1);
        }}
        onPrevious={() => {
          const prevCursor = cursorHistory[currentIndex - 1];
          loadPage(prevCursor ?? null, currentIndex - 1);
        }}
      />

      {isAdmin() && showRegister && (
        <RegisterDeviceModal
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false);
            reload();
          }}
        />
      )}
    </section>
  );
}
