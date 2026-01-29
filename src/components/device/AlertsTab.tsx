import type { AlertItem } from "../../types/alert";

const severityColors: Record<AlertItem["severity"], string> = {
  NONE: "border-gray-600 text-gray-400",
  LOW: "border-green-500 text-green-400",
  MEDIUM: "border-yellow-500 text-yellow-400",
  HIGH: "border-orange-500 text-orange-400",
  CRITICAL: "border-red-500 text-red-400",
};

export default function AlertsTab({
  alerts,
  loading,
}: {
  alerts: AlertItem[] | null;
  loading: boolean;
}) {
  if (loading) return <div className="text-gray-400">Loading alerts…</div>;
  if (!alerts || alerts.length === 0)
    return <div className="text-gray-400">No alerts</div>;

  return (
    <div className="space-y-2">
      {alerts.map((a) => (
        <div
          key={a.created_at + a.message} // avoid duplicate key
          className={`p-3 rounded bg-[#111827] border ${severityColors[a.severity]}`}
        >
          <div className="flex justify-between">
            <span className="font-medium">{a.message}</span>
            <span className="text-sm">{a.severity}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(a.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
