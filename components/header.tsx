"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { UserMenu } from "@/components/user-menu"
import { GlobalSearch } from "@/components/global-search"
import { NotificationCenter } from "@/components/notification-center"
import Image from "next/image"

const languages = [
  { code: "uz", name: "O'zbek" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "ky", name: "Кыргызча" },
  { code: "kk", name: "Қазақша" },
  { code: "tg", name: "Тоҷикӣ" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [hasInitialized, setHasInitialized] = useState(false)
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      return
    }

    const translations = {
      uz: {
        title: "Til o'zgartirildi",
        description: "Interfeys tili o'zbek tiliga o'zgartirildi",
      },
      ru: {
        title: "Язык изменен",
        description: "Язык интерфейса изменен на русский",
      },
      en: {
        title: "Language changed",
        description: "Interface language changed to English",
      },
      ky: {
        title: "Тил өзгөртүлдү",
        description: "Интерфейс тили кыргызчага өзгөртүлдү",
      },
      kk: {
        title: "Тіл өзгертілді",
        description: "Интерфейс тілі қазақшаға өзгертілді",
      },
      tg: {
        title: "Забон тағйир ёфт",
        description: "Забони интерфейс ба тоҷикӣ тағйир ёфт",
      },
    }

    const t = translations[language]

    toast({
      title: t.title,
      description: t.description,
      duration: 2000,
    })
  }, [language, toast, hasInitialized])

  const navigation = [
    {
      name:
        language === "uz"
          ? "Bosh sahifa"
          : language === "ru"
            ? "Главная"
            : language === "ky"
              ? "Башкы бет"
              : language === "kk"
                ? "Басты бет"
                : language === "tg"
                  ? "Саҳифаи асосӣ"
                  : "Home",
      href: "/",
    },
    {
      name:
        language === "uz"
          ? "Jurnal haqida"
          : language === "ru"
            ? "О журнале"
            : language === "ky"
              ? "Журнал туралу"
              : language === "kk"
                ? "Журнал туралы"
                : language === "tg"
                  ? "Дар бораи маҷалла"
                  : "About",
      href: "/about",
    },
    {
      name:
        language === "uz"
          ? "Tahririyat hay'ati"
          : language === "ru"
            ? "Редакционная коллегия"
            : language === "ky"
              ? "Редакциялық алқа"
              : language === "kk"
                ? "Редакциялық алқа"
                : language === "tg"
                  ? "Ҳайати таҳрир"
                  : "Editorial Board",
      href: "/editorial-board",
    },
    {
      name:
        language === "uz"
          ? "Mualliflar uchun"
          : language === "ru"
            ? "Для авторов"
            : language === "ky"
              ? "Авторларға"
              : language === "kk"
                ? "Авторларға"
                : language === "tg"
                  ? "Барои муаллифон"
                  : "For Authors",
      href: "/for-authors",
    },
    {
      name:
        language === "uz"
          ? "Arxiv"
          : language === "ru"
            ? "Архив"
            : language === "ky"
              ? "Мұрағат"
              : language === "kk"
                ? "Мұрағат"
                : language === "tg"
                  ? "Бойгонӣ"
                  : "Archive",
      href: "/archive",
    },
    {
      name:
        language === "uz"
          ? "Aloqa"
          : language === "ru"
            ? "Контакты"
            : language === "ky"
              ? "Байланыс"
              : language === "kk"
                ? "Байланыс"
                : language === "tg"
                  ? "Тамос"
                  : "Contact",
      href: "/contact",
    },
  ]

  const submitButtonText =
    language === "uz"
      ? "Maqola yuborish"
      : language === "ru"
        ? "Подать статью"
        : language === "ky"
          ? "Мақала тапсыру"
          : language === "kk"
            ? "Мақала тапсыру"
            : language === "tg"
              ? "Пешниҳоди мақола"
              : "Submit Article"

  const adminPanelText =
    language === "uz"
      ? "Admin panel"
      : language === "ru"
        ? "Админ панель"
        : language === "ky"
          ? "Админ панели"
          : language === "kk"
            ? "Админ панелі"
            : language === "tg"
              ? "Панели админ"
              : "Admin Panel"

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-shadow hover:shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white">
            {/* <span className="text-xl font-bold">PSR</span> */}
            <Image src="/ЛОГО.png" alt='' width="50" height="50" />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-foreground">Progressive Science</span>
            <span className="text-xs text-muted-foreground">International Journal</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          {user && (user.role === "admin" || user.role === "editor") && (
            <Link href="/admin" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              {adminPanelText}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Global Search Button */}
          <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="hidden md:inline-flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notification Center for Logged in Users */}
          {user && <NotificationCenter />}

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                {languages.find((l) => l.code === language)?.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as "uz" | "en" | "ru" | "ky" | "kk" | "tg")}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu if Logged In, Otherwise Show Submit Button */}
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/submit-article">{submitButtonText}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex bg-transparent">
                <Link href="/auth/login">
                  {language === "uz"
                    ? "Kirish"
                    : language === "ru"
                      ? "Войти"
                      : language === "ky"
                        ? "Кирүү"
                        : language === "kk"
                          ? "Кіру"
                          : language === "tg"
                            ? "Ворид шудан"
                            : "Login"}
                </Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-white lg:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (user.role === "admin" || user.role === "editor") && (
              <Link
                href="/admin"
                className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {adminPanelText}
              </Link>
            )}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/submit-article">{submitButtonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
