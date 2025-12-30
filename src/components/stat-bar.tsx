import { Progress } from "@/components/ui/progress"
import { MAX_STAT } from "@/lib/constants"

interface StatBarProps {
  label: string
  value: number
  color: string
}

export function StatBar({ label, value, color }: StatBarProps) {
  const percentage = (value / MAX_STAT) * 100
  const isLow = value <= 25
  const displayColor = isLow ? "#ef4444" : color

  return (
    <div className={`flex items-center gap-3 w-48 ${isLow ? "animate-pulse" : ""}`}>
      <span className={`text-sm font-mono w-20 ${isLow ? "text-red-500 font-bold" : ""}`}>
        {label}
      </span>
      <Progress
        value={percentage}
        className="flex-1 h-4"
        style={{ "--progress-color": displayColor } as React.CSSProperties}
      />
      <span className={`text-sm font-mono w-8 text-right ${isLow ? "text-red-500 font-bold" : ""}`}>
        {value}
      </span>
    </div>
  )
}
