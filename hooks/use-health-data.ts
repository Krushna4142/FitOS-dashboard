"use client"

import { useState, useEffect } from "react"
import { healthApi } from "@/lib/api"

export function useHealthData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await healthApi.getCurrent()
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch health data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [])

  const refresh = () => {
    fetchData()
  }

  return {
    data,
    loading,
    error,
    refresh,
  }
}
