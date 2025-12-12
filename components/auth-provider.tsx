"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  refresh: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refresh: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = () => {
    setUser(getCurrentUser())
  }

  useEffect(() => {
    setUser(getCurrentUser())
    setIsLoading(false)
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, refresh }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
