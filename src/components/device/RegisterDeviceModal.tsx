import { useState } from "react";
import { registerDevice } from "../../api/dashboard";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type FormState = {
  vendor_name: string;
  vendor_id: string; // UUID
  device_identifier: string;
  device_name: string;
  device_model: string;
};

const REQUIRED_FIELDS: (keyof FormState)[] = [
  "vendor_name",
  "vendor_id",
  "device_identifier",
  "device_name",
  "device_model",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function RegisterDeviceModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    vendor_name: "",
    vendor_id: "",
    device_identifier: "",
    device_name: "",
    device_model: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVendorIdValid = UUID_REGEX.test(form.vendor_id.trim());

  const isValid =
    REQUIRED_FIELDS.every((k) => form[k].trim().length > 0) &&
    isVendorIdValid;

  const submit = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      await registerDevice(form);
      onSuccess();
      onClose();
    } catch (e: any) {
      if (e.response?.status === 422) {
        setError("Invalid input. Ensure Vendor ID is a valid UUID.");
      } else if (e.response?.status === 409) {
        setError("Device already registered or previously decommissioned.");
      } else {
        setError("Failed to register device.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black/60 flex justify-center items-start pt-12">
      <div className="bg-[#1f2937] p-5 rounded w-400px space-y-3 shadow-xl">
        <h3 className="font-semibold text-lg">Register Device</h3>

        <input
          placeholder="vendor name"
          value={form.vendor_name}
          onChange={(e) =>
            setForm({ ...form, vendor_name: e.target.value })
          }
          className="w-full p-2 rounded bg-[#374151] text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          placeholder="vendor id (UUID)"
          value={form.vendor_id}
          onChange={(e) =>
            setForm({ ...form, vendor_id: e.target.value })
          }
          className={`w-full p-2 rounded text-sm outline-none bg-[#374151]
            ${
              form.vendor_id.length > 0 && !isVendorIdValid
                ? "ring-2 ring-red-500"
                : "focus:ring-2 focus:ring-blue-600"
            }`}
        />

        <input
          placeholder="device identifier"
          value={form.device_identifier}
          onChange={(e) =>
            setForm({ ...form, device_identifier: e.target.value })
          }
          className="w-full p-2 rounded bg-[#374151] text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          placeholder="device name"
          value={form.device_name}
          onChange={(e) =>
            setForm({ ...form, device_name: e.target.value })
          }
          className="w-full p-2 rounded bg-[#374151] text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          placeholder="device model"
          value={form.device_model}
          onChange={(e) =>
            setForm({ ...form, device_model: e.target.value })
          }
          className="w-full p-2 rounded bg-[#374151] text-sm outline-none focus:ring-2 focus:ring-blue-600"
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-sm text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={!isValid || loading}
            className="px-4 py-1.5 rounded bg-blue-600 text-sm disabled:opacity-50"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
