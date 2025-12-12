"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { register } from "@/lib/auth"
import { useLanguage } from "@/lib/language-context"

export default function RegisterPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "reader" as "author" | "reviewer" | "reader",
    affiliation: "",
    orcid: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError(
        language === "uz"
          ? "Parollar mos kelmaydi"
          : language === "ru"
            ? "Пароли не совпадают"
            : "Passwords do not match",
      )
      return
    }

    setIsLoading(true)

    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      affiliation: formData.affiliation || undefined,
      orcid: formData.orcid || undefined,
    })

    if (result.success) {
      router.push("/auth/login")
    } else {
      setError(result.error || "Registration failed")
    }

    setIsLoading(false)
  }

  const t = {
    uz: {
      title: "Ro'yxatdan o'tish",
      description: "Yangi hisob yarating",
      name: "To'liq ism",
      email: "Email",
      password: "Parol",
      confirmPassword: "Parolni tasdiqlang",
      role: "Rol",
      roleAuthor: "Muallif",
      roleReviewer: "Taqrizchi",
      roleReader: "O'quvchi",
      affiliation: "Tashkilot (ixtiyoriy)",
      orcid: "ORCID (ixtiyoriy)",
      registerButton: "Ro'yxatdan o'tish",
      haveAccount: "Hisobingiz bormi?",
      login: "Kirish",
    },
    ru: {
      title: "Регистрация",
      description: "Создайте новый аккаунт",
      name: "Полное имя",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      role: "Роль",
      roleAuthor: "Автор",
      roleReviewer: "Рецензент",
      roleReader: "Читатель",
      affiliation: "Организация (необязательно)",
      orcid: "ORCID (необязательно)",
      registerButton: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      login: "Войти",
    },
    en: {
      title: "Register",
      description: "Create a new account",
      name: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      role: "Role",
      roleAuthor: "Author",
      roleReviewer: "Reviewer",
      roleReader: "Reader",
      affiliation: "Affiliation (optional)",
      orcid: "ORCID (optional)",
      registerButton: "Register",
      haveAccount: "Already have an account?",
      login: "Sign in",
    },
    ky: {
      title: "Катталуу",
      description: "Жаңы эсеп ачыңыз",
      name: "Толук аты",
      email: "Email",
      password: "Сырсөз",
      confirmPassword: "Сырсөздү ырастаңыз",
      role: "Ролу",
      roleAuthor: "Автор",
      roleReviewer: "Рецензент",
      roleReader: "Окуучу",
      affiliation: "Уюм (милдеттүү эмес)",
      orcid: "ORCID (милдеттүү эмес)",
      registerButton: "Катталуу",
      haveAccount: "Эсебиңиз барбы?",
      login: "Кирүү",
    },
    kk: {
      title: "Тіркелу",
      description: "Жаңа аккаунт жасаңыз",
      name: "Толық аты",
      email: "Email",
      password: "Құпия сөз",
      confirmPassword: "Құпия сөзді растаңыз",
      role: "Рөлі",
      roleAuthor: "Автор",
      roleReviewer: "Рецензент",
      roleReader: "Оқырман",
      affiliation: "Ұйым (міндетті емес)",
      orcid: "ORCID (міндетті емес)",
      registerButton: "Тіркелу",
      haveAccount: "Аккаунтыңыз бар ма?",
      login: "Кіру",
    },
    tg: {
      title: "Сабти ном",
      description: "Ҳисоби нав эҷод кунед",
      name: "Номи пурра",
      email: "Email",
      password: "Рамз",
      confirmPassword: "Рамзро тасдиқ кунед",
      role: "Нақш",
      roleAuthor: "Муаллиф",
      roleReviewer: "Рецензент",
      roleReader: "Хонанда",
      affiliation: "Созмон (ихтиёрӣ)",
      orcid: "ORCID (ихтиёрӣ)",
      registerButton: "Сабти ном",
      haveAccount: "Ҳисоб доред?",
      login: "Ворид шудан",
    },
  }[language]

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
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
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t.role}</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author">{t.roleAuthor}</SelectItem>
                  <SelectItem value="reviewer">{t.roleReviewer}</SelectItem>
                  <SelectItem value="reader">{t.roleReader}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliation">{t.affiliation}</Label>
              <Input
                id="affiliation"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcid">{t.orcid}</Label>
              <Input
                id="orcid"
                placeholder="0000-0000-0000-0000"
                value={formData.orcid}
                onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "..." : t.registerButton}
            </Button>

            <div className="text-center text-sm">
              {t.haveAccount}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
