'use client'

import type React from 'react'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import { ThirdwebProvider } from 'thirdweb/react'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-dark">
      <ThirdwebProvider>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main
          className="pt-16 transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </ThirdwebProvider>
    </div>
  )
}
