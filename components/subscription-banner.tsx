"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, X } from "lucide-react"
import { addSubscription } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"

export function SubscriptionBanner() {
  const { language } = useLanguage()
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [success, setSuccess] = useState(false)

  if (!isVisible) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (email) {
      addSubscription({
        email,
        type: "newsletter",
        language,
      })

      setSuccess(true)
      setEmail("")

      setTimeout(() => {
        setIsVisible(false)
      }, 2000)
    }
  }

  const t = {
    uz: {
      title: "Yangiliklar bo'yicha obuna bo'ling",
      description: "Oxirgi nashrlar va yangiliklar haqida xabardor bo'ling",
      placeholder: "Email manzilingiz",
      button: "Obuna bo'lish",
      success: "Rahmat! Siz obuna bo'ldingiz",
    },
    ru: {
      title: "Подпишитесь на новости",
      description: "Будьте в курсе последних публикаций и новостей",
      placeholder: "Ваш email",
      button: "Подписаться",
      success: "Спасибо! Вы подписались",
    },
    en: {
      title: "Subscribe to Newsletter",
      description: "Stay updated with latest publications and news",
      placeholder: "Your email",
      button: "Subscribe",
      success: "Thank you! You're subscribed",
    },
    ky: {
      title: "Жаңылыктарга жазылыңыз",
      description: "Акыркы басылмалар жана жаңылыктар жөнүндө билип турууңуз",
      placeholder: "Email дарегиңиз",
      button: "Жазылуу",
      success: "Рахмат! Сиз жазылдыңыз",
    },
    kk: {
      title: "Жаңалықтарға жазылыңыз",
      description: "Соңғы басылымдар мен жаңалықтар туралы хабардар болыңыз",
      placeholder: "Email мекенжайыңыз",
      button: "Жазылу",
      success: "Рақмет! Сіз жазылдыңыз",
    },
    tg: {
      title: "Ба хабарҳо обуна шавед",
      description: "Аз нашрҳо ва хабарҳои охирин огоҳ бошед",
      placeholder: "Email-и шумо",
      button: "Обуна шудан",
      success: "Ташаккур! Шумо обуна шудед",
    },
  }[language]

  return (
    <Card className="relative border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2"
        onClick={() => setIsVisible(false)}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardContent className="pt-6">
        {success ? (
          <div className="flex items-center gap-3 py-4 text-center">
            <Mail className="h-6 w-6 text-primary" />
            <p className="font-medium text-primary">{t.success}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder={t.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">{t.button}</Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
