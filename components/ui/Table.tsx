import type { ReactNode } from "react"

interface TableProps {
  headers: string[]
  data: (string | ReactNode)[][]
  className?: string
}

export default function Table({ headers, data, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, index) => (
              <th key={index} className="text-left py-3 px-4 font-medium text-foreground-secondary text-sm">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/50 hover:bg-background-tertiary/30 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-4 px-4 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
