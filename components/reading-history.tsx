"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import { getReadingHistory } from "@/lib/recommendations"
import { getCurrentUser, type Article } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function ReadingHistory() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const user = getCurrentUser()

  useEffect(() => {
    if (user) {
      const history = getReadingHistory(user.id, 5)
      setArticles(history)
    }
  }, [user])

  if (!user || articles.length === 0) return null

  const t = {
    uz: { title: "O'qish tarixi" },
    ru: { title: "История чтения" },
    en: { title: "Reading History" },
    ky: { title: "Окуу тарыхы" },
    kk: { title: "Оқу тарихы" },
    tg: { title: "Таърихи хондан" },
  }[language]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <CardTitle>{t.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {articles.map((article) => {
            const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)
            const title = (article[`title${langSuffix}` as keyof Article] as string) || article.titleEn

            return (
              <Link key={article.id} href={`/articles/${article.id}`} className="block">
                <div className="rounded p-2 text-sm transition-colors hover:bg-muted">
                  <p className="line-clamp-2">{title}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
