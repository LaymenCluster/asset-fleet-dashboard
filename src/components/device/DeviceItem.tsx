import { isAdmin } from "../../api/auth";
import { DeviceLifecycleActions } from "../device/DeviceLifecycleActions";

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
  device: Device;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function DeviceItem({ device, selected, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect(device.device_id)}
      className={`p-3 rounded flex justify-between cursor-pointer ${
        selected ? "bg-[#374151]" : "bg-[#1f2937] hover:bg-[#374151]"
      }`}
    >
      <div>
        <div className="font-medium">{device.name}</div>
        <div className="text-sm text-gray-400">{device.model}</div>
      </div>

      {isAdmin() && <DeviceLifecycleActions d={device} />}
    </div>
  );
}
