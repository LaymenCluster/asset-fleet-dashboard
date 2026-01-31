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

function normalizeHistory(history: HealthHistoryItem[]) {
  return history
    .map((h) => ({
      ts: new Date(h.changed_at).getTime(),
      score: h.score,
    }))
    .sort((a, b) => a.ts - b.ts);
}

export default function HealthTab({ history, loading }: Props) {
  if (loading) {
    return <div className="text-sm text-gray-400">Loading health history…</div>;
  }

  if (!history || history.length === 0) {
    return <div className="text-gray-400">No health records</div>;
  }

  const data = normalizeHistory(history);

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
            dataKey="ts"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
          <Tooltip
            labelFormatter={(ts) => new Date(Number(ts)).toLocaleString()}
            formatter={(value) => [value, "Health score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
