"use client"

import { useEffect } from "react"
import { initializeMockData } from "@/lib/mock-data"

export function MockDataInitializer() {
  useEffect(() => {
    console.log("[v0] MockDataInitializer mounted")
    const timer = setTimeout(() => {
      initializeMockData()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}
