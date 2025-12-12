"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserNotifications, markNotificationRead, markAllNotificationsRead, type Notification } from "@/lib/storage"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

export function NotificationCenter() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = () => {
    if (!user) return

    const userNotifs = getUserNotifications(user.id)
    setNotifications(userNotifs.slice(0, 10)) // Show last 10
    setUnreadCount(userNotifs.filter((n) => !n.read).length)
  }

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllNotificationsRead(user.id)
      loadNotifications()
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  if (!user) return null

  const t = {
    uz: {
      notifications: "Xabarnomalar",
      markAllRead: "Hammasini o'qilgan qilish",
      noNotifications: "Yangi xabarnomalar yo'q",
    },
    ru: {
      notifications: "Уведомления",
      markAllRead: "Отметить все как прочитанные",
      noNotifications: "Нет новых уведомлений",
    },
    en: {
      notifications: "Notifications",
      markAllRead: "Mark all as read",
      noNotifications: "No new notifications",
    },
    ky: {
      notifications: "Билдирүүлөр",
      markAllRead: "Баарын окулган деп белгилөө",
      noNotifications: "Жаңы билдирүүлөр жок",
    },
    kk: {
      notifications: "Хабарландырулар",
      markAllRead: "Барлығын оқылған деп белгілеу",
      noNotifications: "Жаңа хабарландырулар жоқ",
    },
    tg: {
      notifications: "Огоҳиҳо",
      markAllRead: "Ҳамаро хондашуда нишон додан",
      noNotifications: "Огоҳиҳои нав нест",
    },
  }[language]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t.notifications}</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto p-0 text-xs">
              {t.markAllRead}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">{t.noNotifications}</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start p-4"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${notification.read ? "opacity-60" : ""}`}>
                      {notification.title}
                    </p>
                    <p className={`text-xs text-muted-foreground ${notification.read ? "opacity-60" : ""}`}>
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
