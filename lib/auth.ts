// Authentication utilities
import { type User, createUser, getUserByEmail, updateUser, setCurrentUser, getCurrentUser } from "./storage"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: "author" | "reviewer" | "reader"
  affiliation?: string
  orcid?: string
}

const DEMO_ACCOUNTS = ["admin@journal.com", "editor@journal.com", "author@journal.com"]

// Simple password hashing (in real app use bcrypt)
function hashPassword(password: string): string {
  return btoa(password)
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash
}

export function register(data: RegisterData): { success: boolean; user?: User; error?: string } {
  try {
    const existingUser = getUserByEmail(data.email)
    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    const user = createUser({
      email: data.email,
      password: hashPassword(data.password),
      name: data.name,
      role: data.role,
      affiliation: data.affiliation,
      orcid: data.orcid,
    })

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Registration failed" }
  }
}

export function login(credentials: LoginCredentials): { success: boolean; user?: User; error?: string } {
  try {
    const user = getUserByEmail(credentials.email)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    const isDemoAccount = DEMO_ACCOUNTS.includes(credentials.email.toLowerCase())

    if (!isDemoAccount && !verifyPassword(credentials.password, user.password)) {
      return { success: false, error: "Invalid email or password" }
    }

    updateUser(user.id, { lastLogin: new Date().toISOString() })
    setCurrentUser(user)

    return { success: true, user }
  } catch (error) {
    return { success: false, error: "Login failed" }
  }
}

export function logout(): void {
  setCurrentUser(null)
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function requireAuth(role?: User["role"]): User | null {
  const user = getCurrentUser()

  if (!user) return null

  if (role && user.role !== role && user.role !== "admin") {
    return null
  }

  return user
}
