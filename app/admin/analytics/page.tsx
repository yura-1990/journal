"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText, Users, TrendingUp, Calendar, Award, ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getMockArticles, getMockUsers, getMockReviews } from "@/lib/mock-data"

const translations = {
  uz: {
    title: "Analitika paneli",
    description: "Jurnal samaradorligi va statistika ko'rinishi",
    publishedArticles: "Nashr etilgan maqolalar",
    totalViews: "Jami ko'rishlar",
    totalDownloads: "Jami yuklab olishlar",
    subscribers: "Obunachilar",
    pendingReview: "Ko'rib chiqilmoqda",
    avgReviewTime: "O'rtacha taqriz muddati",
    acceptanceRate: "Qabul qilish darajasi",
    activeReviewers: "Faol taqrizchilar",
    overview: "Umumiy ko'rinish",
    topArticles: "Top maqolalar",
    trends: "Tendentsiyalar",
    fields: "Sohalar",
    searchTerms: "Qidiruv so'zlari",
    reviewStats: "Taqriz statistikasi",
    viewsOverTime: "Vaqt bo'yicha ko'rishlar",
    submissionTrends: "Yuborish tendentsiyalari",
    topMostViewed: "Eng ko'p ko'rilgan maqolalar",
    articlesByField: "Sohalar bo'yicha maqolalar",
    popularSearchTerms: "Mashhur qidiruv so'zlari",
    reviewerPerformance: "Taqrizchilar samaradorligi",
    days: "kun",
    noData: "Ma'lumotlar yo'q",
    searches: "qidiruvlar",
    articles: "maqolalar",
    reviews: "taqrizlar",
    exportReport: "Hisobotni eksport qilish",
    lastMonth: "O'tgan oy",
    thisMonth: "Shu oy",
  },
  ru: {
    title: "Аналитическая панель",
    description: "Обзор эффективности журнала и статистика",
    publishedArticles: "Опубликованные статьи",
    totalViews: "Всего просмотров",
    totalDownloads: "Всего скачиваний",
    subscribers: "Подписчики",
    pendingReview: "На рецензии",
    avgReviewTime: "Среднее время рецензии",
    acceptanceRate: "Процент принятия",
    activeReviewers: "Активные рецензенты",
    overview: "Обзор",
    topArticles: "Топ статьи",
    trends: "Тенденции",
    fields: "Области",
    searchTerms: "Поисковые запросы",
    reviewStats: "Статистика рецензий",
    viewsOverTime: "Просмотры по времени",
    submissionTrends: "Тенденции подач",
    topMostViewed: "Самые просматриваемые статьи",
    articlesByField: "Статьи по областям",
    popularSearchTerms: "Популярные поисковые запросы",
    reviewerPerformance: "Производительность рецензентов",
    days: "дней",
    noData: "Нет данных",
    searches: "поисков",
    articles: "статьи",
    reviews: "рецензии",
    exportReport: "Экспорт отчета",
    lastMonth: "Прошлый месяц",
    thisMonth: "Этот месяц",
  },
  en: {
    title: "Analytics Dashboard",
    description: "Overview of journal performance and statistics",
    publishedArticles: "Published Articles",
    totalViews: "Total Views",
    totalDownloads: "Total Downloads",
    subscribers: "Subscribers",
    pendingReview: "Pending Review",
    avgReviewTime: "Avg Review Time",
    acceptanceRate: "Acceptance Rate",
    activeReviewers: "Active Reviewers",
    overview: "Overview",
    topArticles: "Top Articles",
    trends: "Trends",
    fields: "Fields",
    searchTerms: "Search Terms",
    reviewStats: "Review Stats",
    viewsOverTime: "Views Over Time",
    submissionTrends: "Submission Trends",
    topMostViewed: "Top Most Viewed Articles",
    articlesByField: "Articles by Field",
    popularSearchTerms: "Popular Search Terms",
    reviewerPerformance: "Reviewer Performance",
    days: "days",
    noData: "No data available",
    searches: "searches",
    articles: "articles",
    reviews: "reviews",
    exportReport: "Export Report",
    lastMonth: "Last Month",
    thisMonth: "This Month",
  },
  ky: {
    title: "Аналитикалык панель",
    description: "Журналдын натыйжалуулугу жана статистика",
    publishedArticles: "Жарыяланган макалалар",
    totalViews: "Жалпы көрүүлөр",
    totalDownloads: "Жалпы жүктөөлөр",
    subscribers: "Жазылуучулар",
    pendingReview: "Рецензияда",
    avgReviewTime: "Орточо рецензия убактысы",
    acceptanceRate: "Кабыл алуу деңгээли",
    activeReviewers: "Активдүү рецензенттер",
    overview: "Жалпы көрүнүш",
    topArticles: "Топ макалалар",
    trends: "Тенденциялар",
    fields: "Тармактар",
    searchTerms: "Издөө сөздөрү",
    reviewStats: "Рецензия статистикасы",
    viewsOverTime: "Убакыт боюнча көрүүлөр",
    submissionTrends: "Жөнөтүү тенденциялары",
    topMostViewed: "Эң көп көрүлгөн макалалар",
    articlesByField: "Тармактар боюнча макалалар",
    popularSearchTerms: "Популярдуу издөө сөздөрү",
    reviewerPerformance: "Рецензенттердин натыйжалуулугу",
    days: "күн",
    noData: "Маалымат жок",
    searches: "издөөлөр",
    articles: "макалалар",
    reviews: "рецензиялар",
    exportReport: "Отчетту экспорттоо",
    lastMonth: "Өткөн ай",
    thisMonth: "Бул ай",
  },
  kk: {
    title: "Аналитикалық панель",
    description: "Журналдың тиімділігі және статистикасы",
    publishedArticles: "Жарияланған мақалалар",
    totalViews: "Барлық қараулар",
    totalDownloads: "Барлық жүктеулер",
    subscribers: "Жазылушылар",
    pendingReview: "Рецензияда",
    avgReviewTime: "Орташа рецензия уақыты",
    acceptanceRate: "Қабылдау деңгейі",
    activeReviewers: "Белсенді рецензенттер",
    overview: "Шолу",
    topArticles: "Топ мақалалар",
    trends: "Тенденциялар",
    fields: "Салалар",
    searchTerms: "Іздеу сөздері",
    reviewStats: "Рецензия статистикасы",
    viewsOverTime: "Уақыт бойынша қараулар",
    submissionTrends: "Жіберу тенденциялары",
    topMostViewed: "Ең көп қаралған мақалалар",
    articlesByField: "Салалар бойынша мақалалар",
    popularSearchTerms: "Танымал іздеу сөздері",
    reviewerPerformance: "Рецензенттердің өнімділігі",
    days: "күн",
    noData: "Деректер жоқ",
    searches: "іздеулер",
    articles: "мақалалар",
    reviews: "рецензиялар",
    exportReport: "Есепті экспорттау",
    lastMonth: "Өткен ай",
    thisMonth: "Бұл ай",
  },
  tg: {
    title: "Панели аналитикӣ",
    description: "Намои самаранокии журнал ва статистика",
    publishedArticles: "Мақолаҳои нашршуда",
    totalViews: "Ҳамаи дидан",
    totalDownloads: "Ҳамаи боргириҳо",
    subscribers: "Обунашавандагон",
    pendingReview: "Дар рецензия",
    avgReviewTime: "Вақти миёнаи рецензия",
    acceptanceRate: "Дараҷаи қабул",
    activeReviewers: "Рецензентҳои фаъол",
    overview: "Намои умумӣ",
    topArticles: "Топ мақолаҳо",
    trends: "Тамоюлҳо",
    fields: "Соҳаҳо",
    searchTerms: "Калидвожаҳои ҷустуҷӯ",
    reviewStats: "Статистикаи рецензия",
    viewsOverTime: "Дидан аз рӯи вақт",
    submissionTrends: "Тамоюлҳои ирсол",
    topMostViewed: "Мақолаҳои беҳтарин дидашуда",
    articlesByField: "Мақолаҳо аз рӯи соҳаҳо",
    popularSearchTerms: "Калидвожаҳои маъмул",
    reviewerPerformance: "Самаранокии рецензентҳо",
    days: "рӯз",
    noData: "Маълумот нест",
    searches: "ҷустуҷӯҳо",
    articles: "мақолаҳо",
    reviews: "рецензияҳо",
    exportReport: "Содироти ҳисобот",
    lastMonth: "Моҳи гузашта",
    thisMonth: "Ин моҳ",
  },
}

export default function AnalyticsPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const [articles, setArticles] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    setArticles(getMockArticles())
    setUsers(getMockUsers())
    setReviews(getMockReviews())
  }, [])

  const stats = useMemo(() => {
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
    const totalDownloads = articles.reduce((sum, a) => sum + a.downloads, 0)
    const published = articles.filter((a) => a.status === "published").length
    const pending = articles.filter((a) => a.status === "pending" || a.status === "under_review").length
    const completedReviews = reviews.filter((r) => r.status === "completed")
    const avgReviewTime =
      completedReviews.length > 0
        ? Math.round(
            completedReviews.reduce((sum, r) => {
              const assigned = new Date(r.assignedAt).getTime()
              const completed = new Date(r.completedAt!).getTime()
              return sum + (completed - assigned) / (1000 * 60 * 60 * 24)
            }, 0) / completedReviews.length,
          )
        : 0

    const acceptedArticles = articles.filter((a) => a.status === "accepted" || a.status === "published").length
    const totalSubmitted = articles.length
    const acceptanceRate = totalSubmitted > 0 ? Math.round((acceptedArticles / totalSubmitted) * 100) : 0

    return {
      published,
      pending,
      totalViews,
      totalDownloads,
      avgReviewTime,
      acceptanceRate,
      activeReviewers: users.filter((u) => u.role === "reviewer" && u.isActive).length,
      subscribers: users.filter((u) => u.role === "author").length,
    }
  }, [articles, users, reviews])

  const topArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 10)
  }, [articles])

  const fieldDistribution = useMemo(() => {
    const fieldMap: Record<string, number> = {}
    articles.forEach((a) => {
      fieldMap[a.field] = (fieldMap[a.field] || 0) + 1
    })

    const total = articles.length
    return Object.entries(fieldMap)
      .map(([field, count]) => ({
        field,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [articles])

  const submissionTrends = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString("en", { month: "short", year: "numeric" })
      monthlyData[key] = 0
    }

    articles.forEach((a) => {
      const date = new Date(a.submittedAt)
      const key = date.toLocaleDateString("en", { month: "short", year: "numeric" })
      if (key in monthlyData) {
        monthlyData[key]++
      }
    })

    return Object.entries(monthlyData).map(([label, value]) => ({ label, value }))
  }, [articles])

  const topReviewers = useMemo(() => {
    const reviewerStats = users
      .filter((u) => u.role === "reviewer")
      .map((reviewer) => {
        const reviewerReviews = reviews.filter((r) => r.reviewerId === reviewer.id)
        const completed = reviewerReviews.filter((r) => r.status === "completed").length
        const avgDays =
          completed > 0
            ? Math.round(
                reviewerReviews
                  .filter((r) => r.completedAt)
                  .reduce((sum, r) => {
                    const assigned = new Date(r.assignedAt).getTime()
                    const completedTime = new Date(r.completedAt!).getTime()
                    return sum + (completedTime - assigned) / (1000 * 60 * 60 * 24)
                  }, 0) / completed,
              )
            : 0

        return {
          ...reviewer,
          completed,
          avgDays,
        }
      })
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 10)

    return reviewerStats
  }, [users, reviews])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t.exportReport}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.publishedArticles}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
              +12% {t.lastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalViews}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
              +24% {t.lastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalDownloads}</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
              +18% {t.lastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingReview}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownIcon className="h-3 w-3 text-red-500" />
              -5% {t.lastMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.avgReviewTime}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgReviewTime} {t.days}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.acceptanceRate}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeReviewers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReviewers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.subscribers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="articles">{t.topArticles}</TabsTrigger>
          <TabsTrigger value="trends">{t.trends}</TabsTrigger>
          <TabsTrigger value="fields">{t.fields}</TabsTrigger>
          <TabsTrigger value="reviewers">{t.reviewStats}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.submissionTrends}</CardTitle>
              <CardDescription>Monthly article submissions over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SimpleChart data={submissionTrends} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.topMostViewed}</CardTitle>
              <CardDescription>Articles ranked by view count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <div key={article.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{article.title}</p>
                        <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {article.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.submissionTrends}</CardTitle>
              <CardDescription>Monthly submission patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SimpleChart data={submissionTrends} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.articlesByField}</CardTitle>
              <CardDescription>Distribution across scientific fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fieldDistribution.map((field) => (
                  <div key={field.field} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{field.field}</span>
                      <span className="text-muted-foreground">
                        {field.count} ({field.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${field.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.reviewerPerformance}</CardTitle>
              <CardDescription>Top reviewers by completed reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReviewers.map((reviewer, index) => (
                  <div key={reviewer.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{reviewer.name}</p>
                        <p className="text-xs text-muted-foreground">{reviewer.affiliation}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {reviewer.completed} {t.reviews}
                      </div>
                      <div className="text-muted-foreground">
                        {reviewer.avgDays} {t.days} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SimpleChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 items-end justify-between gap-1">
        {data.map((point, index) => (
          <div key={index} className="group relative flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full rounded-t bg-primary transition-all hover:bg-primary/80"
              style={{ height: `${(point.value / maxValue) * 100}%`, minHeight: point.value > 0 ? "8px" : "0" }}
            />
            <div className="absolute -top-10 hidden rounded bg-popover px-2 py-1 text-xs shadow-md group-hover:block">
              {point.value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        {data.map((point, index) => (
          <div key={index} className="flex-1 text-center">
            {index % 2 === 0 && point.label}
          </div>
        ))}
      </div>
    </div>
  )
}
