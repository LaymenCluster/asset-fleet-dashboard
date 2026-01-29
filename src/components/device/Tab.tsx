type Props = {
  label: string
  active: boolean
  onClick: () => void
}

export default function Tab({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm
        ${active ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}
      `}
    >
      {label}
    </button>
  )
}
