"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { login } from "@/lib/auth"
import { useLanguage } from "@/lib/language-context"
import { initializeDemoAdminUsers } from "@/lib/mock-data"
import { getUsers, getUserByEmail } from "@/lib/storage"

export default function LoginPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const demoAccounts = [
    { email: "admin@journal.com", password: "admin123", role: "Admin" },
    { email: "editor@journal.com", password: "editor123", role: "Editor" },
  ]

  useEffect(() => {
    const users = getUsers()
    console.log("[v0] Total users in storage:", users.length)
    console.log(
      "[v0] All users:",
      users.map((u) => ({ email: u.email, role: u.role })),
    )

    const adminExists = getUserByEmail("admin@journal.com")
    const editorExists = getUserByEmail("editor@journal.com")

    setDebugInfo(`Users: ${users.length} | Admin: ${adminExists ? "✓" : "✗"} | Editor: ${editorExists ? "✓" : "✗"}`)
  }, [])

  const handleReinitialize = () => {
    console.log("[v0] Manual reinitialization requested")
    initializeDemoAdminUsers()

    // Check again
    const users = getUsers()
    const adminExists = getUserByEmail("admin@journal.com")
    const editorExists = getUserByEmail("editor@journal.com")

    setDebugInfo(`Users: ${users.length} | Admin: ${adminExists ? "✓" : "✗"} | Editor: ${editorExists ? "✓" : "✗"}`)

    if (adminExists && editorExists) {
      setError("")
      alert("Demo users initialized successfully! You can now login.")
    } else {
      alert("Error: Demo users not created. Check console logs.")
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError("")
    setIsLoading(true)

    console.log("[v0] Demo login attempt:", demoEmail)
    const result = login({ email: demoEmail, password: demoPassword })
    console.log("[v0] Login result:", result)

    if (result.success && result.user) {
      console.log("[v0] Login successful, user role:", result.user.role)
      if (result.user.role === "admin") {
        console.log("[v0] Redirecting to /admin")
        router.push("/admin")
      } else {
        console.log("[v0] Redirecting to /dashboard")
        router.push("/dashboard")
      }
    } else {
      console.log("[v0] Login failed:", result.error)
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] Manual login attempt:", email)
    const result = login({ email, password })
    console.log("[v0] Login result:", result)

    if (result.success && result.user) {
      console.log("[v0] Login successful, user role:", result.user.role)
      if (result.user.role === "admin") {
        console.log("[v0] Redirecting to /admin")
        router.push("/admin")
      } else {
        console.log("[v0] Redirecting to /dashboard")
        router.push("/dashboard")
      }
    } else {
      console.log("[v0] Login failed:", result.error)
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  const t = {
    uz: {
      title: "Tizimga kirish",
      description: "Hisobingizga kiring",
      email: "Email",
      password: "Parol",
      loginButton: "Kirish",
      noAccount: "Hisobingiz yo'qmi?",
      register: "Ro'yxatdan o'tish",
      demoTitle: "Demo hisoblar",
      demoDescription: "Tezkor kirish uchun demo hisoblardan birini tanlang",
      reinitialize: "Demo foydalanuvchilarni qayta yaratish",
    },
    ru: {
      title: "Вход в систему",
      description: "Войдите в свой аккаунт",
      email: "Email",
      password: "Пароль",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      register: "Зарегистрироваться",
      demoTitle: "Демо аккаунты",
      demoDescription: "Выберите демо аккаунт для быстрого входа",
      reinitialize: "Пересоздать демо пользователей",
    },
    en: {
      title: "Login",
      description: "Sign in to your account",
      email: "Email",
      password: "Password",
      loginButton: "Sign in",
      noAccount: "Don't have an account?",
      register: "Register",
      demoTitle: "Demo Accounts",
      demoDescription: "Select a demo account for quick access",
      reinitialize: "Reinitialize Demo Users",
    },
    ky: {
      title: "Системага кирүү",
      description: "Эсебиңизге кириңиз",
      email: "Email",
      password: "Сырсөз",
      loginButton: "Кирүү",
      noAccount: "Эсебиңиз жокпу?",
      register: "Катталуу",
      demoTitle: "Демо эсептер",
      demoDescription: "Тез кирүү үчүн демо эсепти тандаңыз",
      reinitialize: "Демо колдонуучуларды кайра түзүү",
    },
    kk: {
      title: "Жүйеге кіру",
      description: "Аккаунтыңызға кіріңіз",
      email: "Email",
      password: "Құпия сөз",
      loginButton: "Кіру",
      noAccount: "Аккаунтыңыз жоқ па?",
      register: "Тіркелу",
      demoTitle: "Демо аккаунттар",
      demoDescription: "Жылдам кіру үшін демо аккаунтты таңдаңыз",
      reinitialize: "Демо пайдаланушыларды қайта жасау",
    },
    tg: {
      title: "Ворид ба система",
      description: "Ба ҳисобатон ворид шавед",
      email: "Email",
      password: "Рамз",
      loginButton: "Ворид шудан",
      noAccount: "Ҳисоб надоред?",
      register: "Сабти ном",
      demoTitle: "Ҳисобҳои демо",
      demoDescription: "Барои дастрасии тез ҳисоби деморо интихоб кунед",
      reinitialize: "Аз нав сохтани корбарони демо",
    },
  }[language]

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl gap-8 lg:grid lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "..." : t.loginButton}
              </Button>

              <div className="text-center text-sm">
                {t.noAccount}{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  {t.register}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">{t.demoTitle}</CardTitle>
            <CardDescription>{t.demoDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {debugInfo && <div className="rounded-md bg-muted p-2 text-xs font-mono">{debugInfo}</div>}

            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                onClick={() => handleDemoLogin(account.email, account.password)}
                variant="outline"
                className="w-full justify-start p-4 h-auto"
                disabled={isLoading}
              >
                <div className="w-full text-left">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold">{account.role}</span>
                    <span className="text-xs text-muted-foreground">
                      {language === "uz"
                        ? "Bosish"
                        : language === "ru"
                          ? "Войти"
                          : language === "ky"
                            ? "Басуу"
                            : language === "kk"
                              ? "Басу"
                              : language === "tg"
                                ? "Ворид шудан"
                                : "Login"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{account.email}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {language === "uz"
                      ? "Parol"
                      : language === "ru"
                        ? "Пароль"
                        : language === "ky"
                          ? "Сырсөз"
                          : language === "kk"
                            ? "Құпия сөз"
                            : language === "tg"
                              ? "Рамз"
                              : "Password"}
                    : {account.password}
                  </div>
                </div>
              </Button>
            ))}

            <Button onClick={handleReinitialize} variant="secondary" size="sm" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.reinitialize}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
