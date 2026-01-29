type Props = {
  label: string
  value: number
  accent?: "green" | "yellow" | "red" | "gray"
  active?: boolean
  onClick?: () => void
}

const accentMap: Record<string, string> = {
  green: "border-green-500 text-green-400",
  yellow: "border-yellow-500 text-yellow-400",
  red: "border-red-500 text-red-400",
  gray: "border-gray-500 text-gray-400",
}

export default function FleetStatCard({
  label,
  value,
  accent,
  active,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-lg p-4 border
        ${accent ? accentMap[accent] : "border-[#374151]"}
        ${active ? "bg-[#1f2937]" : "bg-[#111827]"}
        hover:bg-[#1f2937]
        transition
      `}
    >
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
