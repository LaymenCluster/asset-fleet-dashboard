import { Trash2, RotateCcw } from "lucide-react";
import { decommissionDevice, reactivateDevice } from "../../api/dashboard";

type Props = {
  d: {
    device_id: string;
    health_state: string;
    lifecycle_state: string;
  };
};

export function DeviceLifecycleActions({ d }: Props) {
  const confirmAndRun = async (
    message: string,
    action: () => Promise<unknown>,
  ) => {
    if (!window.confirm(message)) return;

    try {
      await action();
    } catch (e: any) {
      if (e.response?.status === 409) {
        alert("Operation already applied.");
      } else {
        alert("Operation failed.");
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{d.health_state}</span>

      {d.lifecycle_state !== "DECOMMISSIONED" && (
        <button
          onClick={() =>
            confirmAndRun("Decommission this device?", () =>
              decommissionDevice(d.device_id),
            )
          }
          title="Decommission device"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
        </button>
      )}

      {d.lifecycle_state === "DECOMMISSIONED" && (
        <button
          onClick={() =>
            confirmAndRun("Reactivate this device?", () =>
              reactivateDevice(d.device_id),
            )
          }
          title="Reactivate device"
          className="text-green-500 hover:text-green-700"
        >
          <RotateCcw size={16} />
        </button>
      )}
    </div>
  );
}
