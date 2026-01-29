import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { HealthHistoryItem } from "../../types/health"

type Props = {
  history: HealthHistoryItem[] | null
  loading: boolean
}

const WINDOW_HOURS = 24

function formatTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function HealthTab({ history, loading }: Props) {
  if (loading) {
    return (
      <div className="text-sm text-gray-400">
        Loading health history…
      </div>
    )
  }
  if (!history || history.length === 0)
    return <div className="text-gray-400">No health records</div>

  const cutoff =
    Date.now() - WINDOW_HOURS * 60 * 60 * 1000

  const filtered = history
    .filter(
      (h) => new Date(h.changed_at).getTime() >= cutoff
    )
    .sort(
      (a, b) =>
        new Date(a.changed_at).getTime() -
        new Date(b.changed_at).getTime()
    )

  if (!filtered.length) {
    return (
      <div className="text-sm text-gray-400">
        No health changes in the last 24 hours
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filtered}>
          <XAxis
            dataKey="changed_at"
            tickFormatter={formatTime}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <Tooltip
            labelFormatter={(label) =>
              new Date(label).toLocaleString()
            }
            formatter={(value) => [
              value,
              "Health score",
            ]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
