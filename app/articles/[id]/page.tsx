"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react"
import {
  getArticleById,
  incrementArticleViews,
  incrementArticleDownloads,
  downloadFile,
  getCurrentUser,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "@/lib/storage"
import { CitationExport } from "@/components/citation-export"
import { ShareButtons } from "@/components/share-buttons"
import { useLanguage } from "@/lib/language-context"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const { language, t } = useLanguage()
  const [article, setArticle] = useState<any>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    const id = params?.id as string
    if (id) {
      const foundArticle = getArticleById(id)
      if (foundArticle) {
        setArticle(foundArticle)
        incrementArticleViews(id, user?.id)

        if (user) {
          setBookmarked(isBookmarked(user.id, id))
        }
      }
    }
  }, [params?.id]) // Removed user?.id from dependencies

  const handleDownload = () => {
    if (article) {
      incrementArticleDownloads(article.id)
      downloadFile(article.fileData, article.fileName)
    }
  }

  const handleBookmark = () => {
    if (!user || !article) return

    if (bookmarked) {
      removeBookmark(user.id, article.id)
      setBookmarked(false)
    } else {
      addBookmark(user.id, article.id)
      setBookmarked(true)
    }
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Article not found</p>
      </div>
    )
  }

  const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)
  const title = article[`title${langSuffix}`] || article.titleEn
  const author = article[`authorName${langSuffix}`] || article.authorNameEn
  const workplace = article[`workplace${langSuffix}`] || article.workplaceEn
  const position = article[`position${langSuffix}`] || article.positionEn
  const keywords = article[`keywords${langSuffix}`] || article.keywordsEn

  const translations = {
    uz: {
      back: "Orqaga",
      author: "Muallif",
      workplace: "Ish joyi",
      position: "Lavozim",
      fieldOfScience: "Fan sohasi",
      keywords: "Kalit so'zlar",
      published: "Nashr etilgan",
      views: "Ko'rishlar",
      downloads: "Yuklanishlar",
      download: "Yuklash",
      bookmark: "Saqlash",
      bookmarked: "Saqlangan",
      doi: "DOI",
    },
    ru: {
      back: "Назад",
      author: "Автор",
      workplace: "Место работы",
      position: "Должность",
      fieldOfScience: "Область науки",
      keywords: "Ключевые слова",
      published: "Опубликовано",
      views: "Просмотры",
      downloads: "Загрузки",
      download: "Скачать",
      bookmark: "Сохранить",
      bookmarked: "Сохранено",
      doi: "DOI",
    },
    en: {
      back: "Back",
      author: "Author",
      workplace: "Workplace",
      position: "Position",
      fieldOfScience: "Field of Science",
      keywords: "Keywords",
      published: "Published",
      views: "Views",
      downloads: "Downloads",
      download: "Download",
      bookmark: "Bookmark",
      bookmarked: "Bookmarked",
      doi: "DOI",
    },
    ky: {
      back: "Артка",
      author: "Автор",
      workplace: "Иш орду",
      position: "Кызмат орун",
      fieldOfScience: "Илим тармагы",
      keywords: "Ачкыч сөздөр",
      published: "Жарыяланды",
      views: "Көрүүлөр",
      downloads: "Жүктөөлөр",
      download: "Жүктөө",
      bookmark: "Сактоо",
      bookmarked: "Сакталды",
      doi: "DOI",
    },
    kk: {
      back: "Артқа",
      author: "Автор",
      workplace: "Жұмыс орны",
      position: "Лауазым",
      fieldOfScience: "Ғылым саласы",
      keywords: "Кілт сөздер",
      published: "Жарияланды",
      views: "Көрулер",
      downloads: "Жүктеулер",
      download: "Жүктеу",
      bookmark: "Сақтау",
      bookmarked: "Сақталды",
      doi: "DOI",
    },
    tg: {
      back: "Бозгашт",
      author: "Муаллиф",
      workplace: "Ҷои кор",
      position: "Вазифа",
      fieldOfScience: "Соҳаи илм",
      keywords: "Калимаҳои калидӣ",
      published: "Нашр шуд",
      views: "Дидан",
      downloads: "Боргириҳо",
      download: "Боргирӣ",
      bookmark: "Нигоҳ доштан",
      bookmarked: "Нигоҳ дошта шуд",
      doi: "DOI",
    },
  }[language]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t.home, href: "/" },
          { label: t.archive, href: "/archive" },
          { label: title.substring(0, 50) + "..." },
        ]}
      />

      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {translations.back}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="mb-4 text-3xl">{title}</CardTitle>
              <CardDescription className="space-y-2 text-base">
                <p>
                  <span className="font-semibold">{translations.author}:</span> {author}
                </p>
                <p>
                  <span className="font-semibold">{translations.workplace}:</span> {workplace}
                </p>
                <p>
                  <span className="font-semibold">{translations.position}:</span> {position}
                </p>
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="justify-center">
                {article.fieldOfScience}
              </Badge>
              <Badge variant="secondary" className="justify-center">
                {new Date(article.publishedAt || article.submittedAt).getFullYear()}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">{translations.keywords}</h3>
            <p className="text-sm text-muted-foreground">{keywords}</p>
          </div>

          {article.doi && (
            <div>
              <h3 className="mb-2 font-semibold">{translations.doi}</h3>
              <p className="text-sm text-muted-foreground">{article.doi}</p>
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views || 0} {translations.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {article.downloads || 0} {translations.downloads}
            </span>
            {article.publishedAt && (
              <span>
                {translations.published}: {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              {translations.download}
            </Button>

            {user && (
              <Button variant="outline" onClick={handleBookmark}>
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    {translations.bookmarked}
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-4 w-4" />
                    {translations.bookmark}
                  </>
                )}
              </Button>
            )}

            <CitationExport article={article} />
            <ShareButtons title={title} url={`/articles/${article.id}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
