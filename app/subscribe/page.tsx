"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, Bell } from "lucide-react"
import { addSubscription } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function SubscribePage() {
  const { language, t } = useLanguage()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [subscriptionTypes, setSubscriptionTypes] = useState({
    newsletter: true,
    newIssue: true,
    authorUpdates: false,
  })
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email) {
      setError(translations.emailRequired)
      return
    }

    try {
      if (subscriptionTypes.newsletter) {
        addSubscription({
          email,
          name: name || undefined,
          type: "newsletter",
          language: selectedLanguage,
        })
      }

      if (subscriptionTypes.newIssue) {
        addSubscription({
          email,
          name: name || undefined,
          type: "new-issue",
          language: selectedLanguage,
        })
      }

      if (subscriptionTypes.authorUpdates) {
        addSubscription({
          email,
          name: name || undefined,
          type: "author-updates",
          language: selectedLanguage,
        })
      }

      setSuccess(true)
      setEmail("")
      setName("")

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(translations.subscriptionError)
    }
  }

  const translations = {
    uz: {
      title: "Obunalar",
      description: "Yangiliklar va yangi nashrlar haqida xabardor bo'ling",
      emailLabel: "Email manzil",
      emailPlaceholder: "sizning@email.com",
      nameLabel: "Ism (ixtiyoriy)",
      namePlaceholder: "Ismingiz",
      languageLabel: "Til",
      subscriptionTypes: "Obuna turlari",
      newsletter: "Umumiy yangiliklar",
      newsletterDesc: "Jurnalning eng so'nggi yangiliklari va voqealari",
      newIssue: "Yangi nashrlar",
      newIssueDesc: "Har bir yangi son chiqishida xabardor bo'ling",
      authorUpdates: "Muallif yangiliklari",
      authorUpdatesDesc: "Sizning maqolalaringiz holati haqida",
      subscribeButton: "Obuna bo'lish",
      successMessage: "Siz muvaffaqiyatli obuna bo'ldingiz!",
      emailRequired: "Email manzil talab qilinadi",
      subscriptionError: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring",
    },
    ru: {
      title: "Подписка",
      description: "Будьте в курсе новостей и новых публикаций",
      emailLabel: "Email адрес",
      emailPlaceholder: "your@email.com",
      nameLabel: "Имя (необязательно)",
      namePlaceholder: "Ваше имя",
      languageLabel: "Язык",
      subscriptionTypes: "Типы подписки",
      newsletter: "Общие новости",
      newsletterDesc: "Последние новости и события журнала",
      newIssue: "Новые выпуски",
      newIssueDesc: "Уведомления о каждом новом выпуске",
      authorUpdates: "Обновления для авторов",
      authorUpdatesDesc: "Статус ваших статей",
      subscribeButton: "Подписаться",
      successMessage: "Вы успешно подписались!",
      emailRequired: "Требуется email адрес",
      subscriptionError: "Произошла ошибка. Пожалуйста, попробуйте снова",
    },
    en: {
      title: "Subscribe",
      description: "Stay updated with news and new publications",
      emailLabel: "Email Address",
      emailPlaceholder: "your@email.com",
      nameLabel: "Name (optional)",
      namePlaceholder: "Your name",
      languageLabel: "Language",
      subscriptionTypes: "Subscription Types",
      newsletter: "General Newsletter",
      newsletterDesc: "Latest journal news and events",
      newIssue: "New Issues",
      newIssueDesc: "Notifications about each new issue",
      authorUpdates: "Author Updates",
      authorUpdatesDesc: "Status of your articles",
      subscribeButton: "Subscribe",
      successMessage: "You have successfully subscribed!",
      emailRequired: "Email address is required",
      subscriptionError: "An error occurred. Please try again",
    },
    ky: {
      title: "Жазылуу",
      description: "Жаңылыктар жана жаңы басылмалар жөнүндө билип турууңуз",
      emailLabel: "Email дареги",
      emailPlaceholder: "сиздин@email.com",
      nameLabel: "Аты (милдеттүү эмес)",
      namePlaceholder: "Сиздин атыңыз",
      languageLabel: "Тил",
      subscriptionTypes: "Жазылуу түрлөрү",
      newsletter: "Жалпы жаңылыктар",
      newsletterDesc: "Журналдын акыркы жаңылыктары жана окуялары",
      newIssue: "Жаңы чыгарылыштар",
      newIssueDesc: "Ар бир жаңы чыгарылыш жөнүндө билдирүүлөр",
      authorUpdates: "Автор үчүн жаңыртуулар",
      authorUpdatesDesc: "Макалаларыңыздын статусу",
      subscribeButton: "Жазылуу",
      successMessage: "Сиз ийгиликтүү жазылдыңыз!",
      emailRequired: "Email даректи талап кылынат",
      subscriptionError: "Ката кетти. Кайра аракет кылып көрүңүз",
    },
    kk: {
      title: "Жазылу",
      description: "Жаңалықтар мен жаңа басылымдар туралы хабардар болыңыз",
      emailLabel: "Email мекенжайы",
      emailPlaceholder: "сіздің@email.com",
      nameLabel: "Аты (міндетті емес)",
      namePlaceholder: "Сіздің атыңыз",
      languageLabel: "Тіл",
      subscriptionTypes: "Жазылу түрлері",
      newsletter: "Жалпы жаңалықтар",
      newsletterDesc: "Журналдың соңғы жаңалықтары мен оқиғалары",
      newIssue: "Жаңа шығарылымдар",
      newIssueDesc: "Әрбір жаңа шығарылым туралы хабарландырулар",
      authorUpdates: "Автор үшін жаңартулар",
      authorUpdatesDesc: "Мақалаларыңыздың күйі",
      subscribeButton: "Жазылу",
      successMessage: "Сіз сәтті жазылдыңыз!",
      emailRequired: "Email мекенжайы қажет",
      subscriptionError: "Қате орын алды. Қайталап көріңіз",
    },
    tg: {
      title: "Обуна",
      description: "Аз хабарҳо ва нашрҳои нав огоҳ бошед",
      emailLabel: "Суроғаи email",
      emailPlaceholder: "шумо@email.com",
      nameLabel: "Ном (ихтиёрӣ)",
      namePlaceholder: "Номи шумо",
      languageLabel: "Забон",
      subscriptionTypes: "Намудҳои обуна",
      newsletter: "Хабарҳои умумӣ",
      newsletterDesc: "Охирин хабарҳо ва ҳодисаҳои маҷалла",
      newIssue: "Нашрҳои нав",
      newIssueDesc: "Огоҳиҳо дар бораи ҳар нашри нав",
      authorUpdates: "Навсозиҳо барои муаллиф",
      authorUpdatesDesc: "Вазъияти мақолаҳои шумо",
      subscribeButton: "Обуна шудан",
      successMessage: "Шумо бомуваффақият обуна шудед!",
      emailRequired: "Суроғаи email лозим аст",
      subscriptionError: "Хатогӣ ба миён омад. Лутфан аз нав кӯшиш кунед",
    },
  }[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: t.home, href: "/" }, { label: translations.title }]} />

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{translations.title}</CardTitle>
                <CardDescription>{translations.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{translations.successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{translations.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={translations.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{translations.nameLabel}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={translations.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{translations.languageLabel}</Label>
                <Select value={selectedLanguage} onValueChange={(val: any) => setSelectedLanguage(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbekcha</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ky">Кыргызча</SelectItem>
                    <SelectItem value="kk">Қазақша</SelectItem>
                    <SelectItem value="tg">Тоҷикӣ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>{translations.subscriptionTypes}</Label>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={subscriptionTypes.newsletter}
                      onCheckedChange={(checked) =>
                        setSubscriptionTypes({ ...subscriptionTypes, newsletter: !!checked })
                      }
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="newsletter"
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {translations.newsletter}
                      </label>
                      <p className="text-sm text-muted-foreground">{translations.newsletterDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newIssue"
                      checked={subscriptionTypes.newIssue}
                      onCheckedChange={(checked) => setSubscriptionTypes({ ...subscriptionTypes, newIssue: !!checked })}
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="newIssue"
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {translations.newIssue}
                      </label>
                      <p className="text-sm text-muted-foreground">{translations.newIssueDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="authorUpdates"
                      checked={subscriptionTypes.authorUpdates}
                      onCheckedChange={(checked) =>
                        setSubscriptionTypes({ ...subscriptionTypes, authorUpdates: !!checked })
                      }
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="authorUpdates"
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {translations.authorUpdates}
                      </label>
                      <p className="text-sm text-muted-foreground">{translations.authorUpdatesDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Bell className="mr-2 h-4 w-4" />
                {translations.subscribeButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
