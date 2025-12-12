"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/storage"
import { logout } from "@/lib/auth"
import { getArticles, getUserNotifications, getUserBookmarks, getArticleById } from "@/lib/storage"
import { FileText, Bell, Bookmark, User, LogOut, Upload } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export default function DashboardPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [user, setUser] = useState(getCurrentUser())
  const [myArticles, setMyArticles] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    // Load user's articles
    const articles = getArticles().filter((a) => a.email === currentUser.email)
    setMyArticles(articles)

    // Load bookmarks
    const userBookmarks = getUserBookmarks(currentUser.id)
    const bookmarkedArticles = userBookmarks.map((b) => getArticleById(b.articleId)).filter((a) => a !== null)
    setBookmarks(bookmarkedArticles)

    // Load notifications
    const userNotifs = getUserNotifications(currentUser.id)
    setNotifications(userNotifs)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  const t = {
    uz: {
      title: "Shaxsiy kabinet",
      welcome: "Xush kelibsiz",
      myArticles: "Mening maqolalarim",
      bookmarks: "Saqlangan",
      notifications: "Xabarnomalar",
      profile: "Profil",
      logout: "Chiqish",
      submitNew: "Yangi maqola yuborish",
      status: "Holat",
      submitted: "Yuborilgan",
      noArticles: "Hali maqolalar yo'q",
      noBookmarks: "Saqlangan maqolalar yo'q",
      noNotifications: "Yangi xabarnomalar yo'q",
    },
    ru: {
      title: "Личный кабинет",
      welcome: "Добро пожаловать",
      myArticles: "Мои статьи",
      bookmarks: "Закладки",
      notifications: "Уведомления",
      profile: "Профиль",
      logout: "Выйти",
      submitNew: "Подать новую статью",
      status: "Статус",
      submitted: "Отправлено",
      noArticles: "Пока нет статей",
      noBookmarks: "Нет сохраненных статей",
      noNotifications: "Нет новых уведомлений",
    },
    en: {
      title: "Dashboard",
      welcome: "Welcome",
      myArticles: "My Articles",
      bookmarks: "Bookmarks",
      notifications: "Notifications",
      profile: "Profile",
      logout: "Logout",
      submitNew: "Submit New Article",
      status: "Status",
      submitted: "Submitted",
      noArticles: "No articles yet",
      noBookmarks: "No bookmarked articles",
      noNotifications: "No new notifications",
    },
    ky: {
      title: "Жеке кабинет",
      welcome: "Кош келиңиз",
      myArticles: "Менин макалаларым",
      bookmarks: "Сакталгандар",
      notifications: "Билдирүүлөр",
      profile: "Профиль",
      logout: "Чыгуу",
      submitNew: "Жаңы макала жөнөтүү",
      status: "Статус",
      submitted: "Жөнөтүлдү",
      noArticles: "Али макалалар жок",
      noBookmarks: "Сакталган макалалар жок",
      noNotifications: "Жаңы билдирүүлөр жок",
    },
    kk: {
      title: "Жеке кабинет",
      welcome: "Қош келдіңіз",
      myArticles: "Менің мақалаларым",
      bookmarks: "Сақталғандар",
      notifications: "Хабарландырулар",
      profile: "Профиль",
      logout: "Шығу",
      submitNew: "Жаңа мақала жіберу",
      status: "Статус",
      submitted: "Жіберілді",
      noArticles: "Әлі мақалалар жоқ",
      noBookmarks: "Сақталған мақалалар жоқ",
      noNotifications: "Жаңа хабарландырулар жоқ",
    },
    tg: {
      title: "Кабинети шахсӣ",
      welcome: "Хуш омадед",
      myArticles: "Мақолаҳои ман",
      bookmarks: "Нишонгузоришуда",
      notifications: "Огоҳиҳо",
      profile: "Профил",
      logout: "Баромадан",
      submitNew: "Мақолаи нав фиристодан",
      status: "Вазъият",
      submitted: "Фиристода шуд",
      noArticles: "Ҳоло мақолаҳо нест",
      noBookmarks: "Мақолаҳои нишонгузоришуда нест",
      noNotifications: "Огоҳиҳои нав нест",
    },
  }[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">
            {t.welcome}, {user.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/submit-article">
              <Upload className="mr-2 h-4 w-4" />
              {t.submitNew}
            </Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t.logout}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">
            <FileText className="mr-2 h-4 w-4" />
            {t.myArticles}
          </TabsTrigger>
          <TabsTrigger value="bookmarks">
            <Bookmark className="mr-2 h-4 w-4" />
            {t.bookmarks}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {t.notifications}
            {notifications.filter((n) => !n.read).length > 0 && (
              <Badge className="ml-2" variant="destructive">
                {notifications.filter((n) => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            {t.profile}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {myArticles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t.noArticles}</p>
              </CardContent>
            </Card>
          ) : (
            myArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{article.titleEn}</CardTitle>
                      <CardDescription className="mt-2">
                        {t.submitted}: {new Date(article.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        article.status === "approved" || article.status === "published"
                          ? "default"
                          : article.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4">
          {bookmarks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t.noBookmarks}</p>
              </CardContent>
            </Card>
          ) : (
            bookmarks.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle>{article.titleEn}</CardTitle>
                  <CardDescription>{article.authorNameEn}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t.noNotifications}</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notif) => (
              <Card key={notif.id} className={notif.read ? "opacity-60" : ""}>
                <CardHeader>
                  <CardTitle className="text-base">{notif.title}</CardTitle>
                  <CardDescription>{notif.message}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t.profile}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Name</Label>
                <p>{user.name}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Email</Label>
                <p>{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Role</Label>
                <p className="capitalize">{user.role}</p>
              </div>
              {user.affiliation && (
                <div>
                  <Label className="text-sm font-semibold">Affiliation</Label>
                  <p>{user.affiliation}</p>
                </div>
              )}
              {user.orcid && (
                <div>
                  <Label className="text-sm font-semibold">ORCID</Label>
                  <p>{user.orcid}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
