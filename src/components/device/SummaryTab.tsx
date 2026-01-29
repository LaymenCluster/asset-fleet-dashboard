type Summary = {
  device_id: string;
  name: string;
  model: string;
  lifecycle_state: string;
  health_state: string;
  health_score: number;
  last_seen: number;
  is_offline: boolean;
  active_alert_severity: string | null;
};

export default function SummaryTab({ summary }: { summary: Summary }) {
  return (
    <div className="space-y-2">
      <Row label="Health state" value={summary.health_state} />
      <Row label="Health score" value={summary.health_score} />
      <Row label="Lifecycle" value={summary.lifecycle_state} />
      <Row
        label="Last seen"
        value={formatLastSeen(summary.last_seen)}
        danger={summary.is_offline}
      />
      <Row
        label="Active alert"
        value={summary.active_alert_severity ?? "None"}
      />
    </div>
  );
}

function Row({
  label,
  value,
  danger,
}: {
  label: string;
  value: any;
  danger?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={danger ? "text-red-400" : ""}>{value}</span>
    </div>
  );
}

function formatLastSeen(epochSeconds: number) {
  const mins = Math.floor((Date.now() - epochSeconds * 1000) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} hr ago`;
}
