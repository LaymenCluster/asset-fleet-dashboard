import { useState } from "react";
import { registerDevice } from "../../api/dashboard";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export function RegisterDeviceModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    vendor_name: "",
    vendor_id: "",
    device_identifier: "",
    device_name: "",
    device_model: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      await registerDevice(form);
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message ?? "Failed to register device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1f2937] p-4 rounded w-400px space-y-3">
        <h3 className="font-semibold">Register Device</h3>

        {Object.entries(form).map(([k, v]) => (
          <input
            key={k}
            placeholder={k.replace("_", " ")}
            value={v}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="w-full p-2 rounded bg-[#374151] text-sm"
          />
        ))}

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-3 py-1 rounded bg-blue-600 text-sm disabled:opacity-50"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
