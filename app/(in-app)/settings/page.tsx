"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Globe, Shield, Sliders, Bell, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp } from "lucide-react"

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum")
  const [mevProtection, setMevProtection] = useState(true)
  const [autoSlippage, setAutoSlippage] = useState(true)
  const [expertMode, setExpertMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(false)
  const { toast } = useToast()

  const networks = [
    { value: "ethereum", label: "Ethereum Mainnet", icon: "⟠" },
    { value: "polygon", label: "Polygon", icon: "🔷" },
    { value: "arbitrum", label: "Arbitrum One", icon: "🔵" },
    { value: "optimism", label: "Optimism", icon: "🔴" },
    { value: "bsc", label: "BNB Smart Chain", icon: "🟡" },
  ]

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    })
  }

  const handleResetSettings = () => {
    setDarkMode(true)
    setSelectedNetwork("ethereum")
    setMevProtection(true)
    setAutoSlippage(true)
    setExpertMode(false)
    setNotifications(true)
    setSoundEffects(false)

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults",
    })
  }

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: any
    title: string
    description: string
    children: React.ReactNode
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start space-x-3 flex-1">
        <div className="p-2 bg-neon-cyan/20 rounded-xl mt-1">
          <Icon className="h-4 w-4 text-neon-cyan" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-foreground-secondary">{description}</p>
        </div>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  )

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-foreground-secondary">Customize your FlashLink experience</p>
          </div>

          {/* Appearance Settings */}
          <Card className="mb-6 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-neon-purple/20 rounded-2xl">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-neon-purple" />
                ) : (
                  <Sun className="h-5 w-5 text-neon-purple" />
                )}
              </div>
              <h2 className="text-xl font-bold">Appearance</h2>
            </div>

            <SettingItem
              icon={darkMode ? Moon : Sun}
              title="Dark Mode"
              description="Use dark theme across the application"
            >
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </SettingItem>

            <SettingItem
              icon={Bell}
              title="Notifications"
              description="Receive notifications for completed transactions"
            >
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </SettingItem>

            <SettingItem icon={Zap} title="Sound Effects" description="Play sounds for interactions and notifications">
              <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
            </SettingItem>
          </Card>

          {/* Network Settings */}
          <Card className="mb-6 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-neon-blue/20 rounded-2xl">
                <Globe className="h-5 w-5 text-neon-blue" />
              </div>
              <h2 className="text-xl font-bold">Network</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-2">Default Network</label>
                <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{networks.find((n) => n.value === selectedNetwork)?.icon}</span>
                        <span>{networks.find((n) => n.value === selectedNetwork)?.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{network.icon}</span>
                          <span>{network.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Trading Settings */}
          <Card className="mb-6 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-neon-green/20 rounded-2xl">
                <Shield className="h-5 w-5 text-neon-green" />
              </div>
              <h2 className="text-xl font-bold">Trading</h2>
            </div>

            <div className="space-y-4">
              <SettingItem
                icon={Shield}
                title="MEV Protection"
                description="Protect your trades from MEV attacks and front-running"
              >
                <Switch checked={mevProtection} onCheckedChange={setMevProtection} />
              </SettingItem>

              <SettingItem
                icon={TrendingUp}
                title="Auto Slippage"
                description="Automatically calculate optimal slippage tolerance"
              >
                <Switch checked={autoSlippage} onCheckedChange={setAutoSlippage} />
              </SettingItem>
            </div>
          </Card>

          {/* Advanced Settings */}
          <Card className="mb-6 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-neon-pink/20 rounded-2xl">
                <Sliders className="h-5 w-5 text-neon-pink" />
              </div>
              <h2 className="text-xl font-bold">Advanced</h2>
            </div>

            <div className="space-y-4">
              <SettingItem
                icon={Sliders}
                title="Expert Mode"
                description="Enable advanced trading features and bypass confirmation dialogs"
              >
                <Switch checked={expertMode} onCheckedChange={setExpertMode} />
              </SettingItem>

              {expertMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-2xl"
                >
                  <p className="text-sm text-neon-pink">
                    ⚠️ Expert mode enables advanced features that may result in unexpected behavior. Use with caution and
                    ensure you understand the risks.
                  </p>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSaveSettings} className="flex-1">
              Save Settings
            </Button>
            <Button variant="secondary" onClick={handleResetSettings} className="flex-1">
              Reset to Defaults
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
