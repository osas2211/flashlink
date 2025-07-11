"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface DropdownOption {
  value: string
  label: string
  symbol?: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Dropdown({ options, value, onChange, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-background-secondary border border-border rounded-2xl hover:border-neon-cyan/50 transition-all duration-300 min-w-[120px]"
      >
        <div className="w-6 h-6 bg-gradient-neon rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-black">
            {selectedOption?.symbol?.[0] || selectedOption?.label[0]}
          </span>
        </div>
        <span className="font-medium">{selectedOption?.symbol || selectedOption?.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-border rounded-2xl shadow-soft z-50 max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-background-tertiary transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="w-6 h-6 bg-gradient-neon rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">{option.symbol?.[0] || option.label[0]}</span>
                </div>
                <div>
                  <div className="font-medium">{option.symbol || option.label}</div>
                  {option.symbol && <div className="text-xs text-foreground-secondary">{option.label}</div>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
