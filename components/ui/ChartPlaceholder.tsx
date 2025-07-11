import { TrendingUp } from "lucide-react"

interface ChartPlaceholderProps {
  height?: string
  className?: string
}

export default function ChartPlaceholder({ height = "200px", className = "" }: ChartPlaceholderProps) {
  return (
    <div
      className={`bg-background-tertiary border-2 border-dashed border-border-secondary rounded-2xl flex flex-col items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className="p-4 bg-neon-cyan/20 rounded-2xl mb-4">
        <TrendingUp className="h-8 w-8 text-neon-cyan" />
      </div>
      <h3 className="text-lg font-medium text-foreground-secondary mb-2">Chart Component</h3>
      <p className="text-sm text-foreground-muted text-center max-w-xs">
        Interactive trading chart will be displayed here with real-time price data and technical indicators.
      </p>
    </div>
  )
}
