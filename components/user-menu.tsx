"use client"

import { User, LogOut, Settings, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/lib/language-context"

export function UserMenu() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const { language } = useLanguage()

  if (!user) {
    return (
      <Button onClick={() => router.push("/auth/login")} variant="default" size="sm">
        {language === "uz" ? "Kirish" : language === "ru" ? "Войти" : "Login"}
      </Button>
    )
  }

  const handleLogout = () => {
    logout()
    refresh()
    router.push("/")
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <User className="mr-2 h-4 w-4" />
          {language === "uz" ? "Kabinet" : language === "ru" ? "Кабинет" : "Dashboard"}
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem onClick={() => router.push("/admin")}>
            <Settings className="mr-2 h-4 w-4" />
            {language === "uz" ? "Admin panel" : language === "ru" ? "Админ панель" : "Admin Panel"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/submit-article")}>
          <FileText className="mr-2 h-4 w-4" />
          {language === "uz" ? "Maqola yuborish" : language === "ru" ? "Подать статью" : "Submit Article"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {language === "uz" ? "Chiqish" : language === "ru" ? "Выйти" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
