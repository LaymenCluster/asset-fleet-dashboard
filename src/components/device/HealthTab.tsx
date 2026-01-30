import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HealthHistoryItem } from "../../types/health";

type Props = {
  history: HealthHistoryItem[] | null;
  loading: boolean;
};

/**
 * Aggregate health history by minute, keeping nulls
 * - Multiple points in same minute are averaged if not null
 * - Null scores remain null to create gaps
 */
function aggregateByMinute(history: HealthHistoryItem[]) {
  const buckets = new Map<
    string,
    { sum: number; count: number; hasValue: boolean }
  >();

  for (const h of history) {
    const d = new Date(h.changed_at);
    d.setSeconds(0, 0); // round down to minute
    const key = d.toISOString();

    const prev = buckets.get(key) ?? { sum: 0, count: 0, hasValue: false };
    if (h.score != null) {
      prev.sum += h.score;
      prev.count += 1;
      prev.hasValue = true;
    }
    buckets.set(key, prev);
  }

  return Array.from(buckets.entries())
    .map(([changed_at, v]) => ({
      changed_at,
      score: v.hasValue ? Math.round(v.sum / v.count) : null,
    }))
    .sort(
      (a, b) =>
        new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime(),
    );
}

/**
 * Format X-axis labels as HH:MM
 */
function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function HealthTab({ history, loading }: Props) {
  if (loading) {
    return <div className="text-sm text-gray-400">Loading health history…</div>;
  }

  if (!history || history.length === 0) {
    return <div className="text-gray-400">No health records</div>;
  }

  const data = aggregateByMinute(history);

  if (!data.length) {
    return (
      <div className="text-sm text-gray-400">No health data available</div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
            dataKey="changed_at"
            tickFormatter={formatTime}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value) => [value, "Health score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            connectNulls={false} // important: preserves gaps
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
