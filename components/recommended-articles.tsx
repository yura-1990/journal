"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { getRecommendedArticles } from "@/lib/recommendations"
import { getCurrentUser, type Article } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function RecommendedArticles() {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const user = getCurrentUser()

  useEffect(() => {
    const recommended = getRecommendedArticles(user?.id, 5)
    setArticles(recommended)
  }, [user?.id])

  if (articles.length === 0) return null

  const t = {
    uz: {
      title: "Tavsiya etilgan maqolalar",
      forYou: "Siz uchun",
    },
    ru: {
      title: "Рекомендуемые статьи",
      forYou: "Для вас",
    },
    en: {
      title: "Recommended Articles",
      forYou: "For you",
    },
    ky: {
      title: "Сунушталган макалалар",
      forYou: "Сиз үчүн",
    },
    kk: {
      title: "Ұсынылған мақалалар",
      forYou: "Сіз үшін",
    },
    tg: {
      title: "Мақолаҳои тавсияшуда",
      forYou: "Барои шумо",
    },
  }[language]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{t.title}</CardTitle>
          {user && <Badge variant="secondary">{t.forYou}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {articles.map((article) => {
            const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)
            const title = (article[`title${langSuffix}` as keyof Article] as string) || article.titleEn
            const author = (article[`authorName${langSuffix}` as keyof Article] as string) || article.authorNameEn

            return (
              <Link key={article.id} href={`/articles/${article.id}`} className="block">
                <div className="rounded-lg border p-3 transition-colors hover:bg-muted">
                  <p className="font-medium leading-tight">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{author}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {article.fieldOfScience}
                    </Badge>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
