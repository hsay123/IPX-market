"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Database, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SetupBanner() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    setIsSettingUp(true)
    setError(null)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to setup database")
      }

      setSetupComplete(true)
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSettingUp(false)
    }
  }

  if (setupComplete) {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <Database className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-600">Setup Complete!</AlertTitle>
        <AlertDescription className="text-green-600">
          Database initialized successfully. Reloading page...
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <CardTitle className="text-amber-900 dark:text-amber-100">Database Setup Required</CardTitle>
            <CardDescription className="text-amber-700 dark:text-amber-300">
              The database hasn't been initialized yet. Click the button below to set up your database with sample data.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleSetup}
          disabled={isSettingUp}
          size="lg"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSettingUp ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Initialize Database
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
