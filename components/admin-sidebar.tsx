"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const translations = {
  uz: {
    dashboard: "Boshqaruv paneli",
    submissions: "Yuborilgan maqolalar",
    users: "Foydalanuvchilar",
    reviewers: "Taqrizchilar",
    analytics: "Analitika",
    issues: "Nashrlar",
    settings: "Sozlamalar",
    notifications: "Bildirishnomalar",
    collapse: "Yig'ish",
    expand: "Kengaytirish",
  },
  ru: {
    dashboard: "Панель управления",
    submissions: "Подачи статей",
    users: "Пользователи",
    reviewers: "Рецензенты",
    analytics: "Аналитика",
    issues: "Выпуски",
    settings: "Настройки",
    notifications: "Уведомления",
    collapse: "Свернуть",
    expand: "Развернуть",
  },
  en: {
    dashboard: "Dashboard",
    submissions: "Submissions",
    users: "Users",
    reviewers: "Reviewers",
    analytics: "Analytics",
    issues: "Issues",
    settings: "Settings",
    notifications: "Notifications",
    collapse: "Collapse",
    expand: "Expand",
  },
  ky: {
    dashboard: "Башкаруу панели",
    submissions: "Жөнөтүлгөн макалалар",
    users: "Колдонуучулар",
    reviewers: "Рецензенттер",
    analytics: "Аналитика",
    issues: "Чыгарылыштар",
    settings: "Жөндөөлөр",
    notifications: "Билдирүүлөр",
    collapse: "Жыйыштыруу",
    expand: "Жайылтуу",
  },
  kk: {
    dashboard: "Басқару панелі",
    submissions: "Жіберілген мақалалар",
    users: "Пайдаланушылар",
    reviewers: "Рецензенттер",
    analytics: "Аналитика",
    issues: "Шығарылымдар",
    settings: "Баптаулар",
    notifications: "Хабарламалар",
    collapse: "Жию",
    expand: "Кеңейту",
  },
  tg: {
    dashboard: "Панели идора",
    submissions: "Мақолаҳои ирсолшуда",
    users: "Корбарон",
    reviewers: "Рецензентҳо",
    analytics: "Аналитика",
    issues: "Нашрҳо",
    settings: "Танзимот",
    notifications: "Огоҳиҳо",
    collapse: "Печондан",
    expand: "Кушодан",
  },
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const t = translations[language]
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    // Get pending submissions count
    const articles = localStorage.getItem("mockArticles")
    if (articles) {
      const parsed = JSON.parse(articles)
      const pending = parsed.filter((a: any) => a.status === "pending").length
      setPendingCount(pending)
    }
  }, [])

  const menuItems = [
    {
      href: "/admin",
      label: t.dashboard,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/submissions",
      label: t.submissions,
      icon: FileText,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      href: "/admin/users",
      label: t.users,
      icon: Users,
    },
    {
      href: "/admin/reviewers",
      label: t.reviewers,
      icon: UserCheck,
    },
    {
      href: "/admin/analytics",
      label: t.analytics,
      icon: BarChart3,
    },
    {
      href: "/admin/issues",
      label: t.issues,
      icon: Calendar,
    },
    {
      href: "/admin/notifications",
      label: t.notifications,
      icon: Bell,
    },
    {
      href: "/admin/settings",
      label: t.settings,
      icon: Settings,
    },
  ]

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname?.startsWith(item.href)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && <span className="text-lg font-semibold">Admin Panel</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("h-8 w-8", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">{isCollapsed ? t.expand : t.collapse}</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant={active ? "secondary" : "default"} className="h-5 min-w-5 px-1 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
