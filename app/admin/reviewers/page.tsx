"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  getMockArticles,
  getMockUsers,
  getMockReviews,
  type MockArticle,
  type MockUser,
  type MockReview,
} from "@/lib/mock-data"
import { AssignReviewerModal } from "@/components/admin/assign-reviewer-modal"
import { ReviewDetailModal } from "@/components/admin/review-detail-modal"
import { useToast } from "@/hooks/use-toast"

const translations = {
  uz: {
    title: "Taqrizlar boshqaruvi",
    description: "Taqrizlarni tayinlash va kuzatish",
    overview: "Umumiy ko'rinish",
    pending: "Kutilmoqda",
    inProgress: "Jarayonda",
    completed: "Yakunlandi",
    overdue: "Muddati o'tgan",
    filterStatus: "Status bo'yicha filtrlash",
    allStatuses: "Barcha statuslar",
    article: "Maqola",
    reviewer: "Taqrizchi",
    assigned: "Tayinlandi",
    dueDate: "Muddati",
    status: "Status",
    progress: "Jarayon",
    actions: "Harakatlar",
    view: "Ko'rish",
    assignReviewer: "Taqrizchi tayinlash",
    noReviews: "Taqrizlar yo'q",
    daysLeft: "kun qoldi",
    daysOverdue: "kun kechikkan",
  },
  ru: {
    title: "Управление рецензиями",
    description: "Назначение и отслеживание рецензий",
    overview: "Обзор",
    pending: "Ожидают",
    inProgress: "В процессе",
    completed: "Завершено",
    overdue: "Просрочено",
    filterStatus: "Фильтр по статусу",
    allStatuses: "Все статусы",
    article: "Статья",
    reviewer: "Рецензент",
    assigned: "Назначено",
    dueDate: "Срок",
    status: "Статус",
    progress: "Прогресс",
    actions: "Действия",
    view: "Просмотр",
    assignReviewer: "Назначить рецензента",
    noReviews: "Нет рецензий",
    daysLeft: "дней осталось",
    daysOverdue: "дней просрочено",
  },
  en: {
    title: "Review Management",
    description: "Assign and track reviews",
    overview: "Overview",
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
    filterStatus: "Filter by status",
    allStatuses: "All statuses",
    article: "Article",
    reviewer: "Reviewer",
    assigned: "Assigned",
    dueDate: "Due Date",
    status: "Status",
    progress: "Progress",
    actions: "Actions",
    view: "View",
    assignReviewer: "Assign Reviewer",
    noReviews: "No reviews",
    daysLeft: "days left",
    daysOverdue: "days overdue",
  },
  ky: {
    title: "Рецензияларды башкаруу",
    description: "Рецензияларды дайындоо жана көзөмөлдөө",
    overview: "Жалпы көрүнүш",
    pending: "Күтүүдө",
    inProgress: "Иштөөдө",
    completed: "Аяктады",
    overdue: "Мөөнөтү өттү",
    filterStatus: "Статус боюнча чыпкалоо",
    allStatuses: "Бардык статустар",
    article: "Макала",
    reviewer: "Рецензент",
    assigned: "Дайындалды",
    dueDate: "Мөөнөтү",
    status: "Статус",
    progress: "Прогресс",
    actions: "Аракеттер",
    view: "Көрүү",
    assignReviewer: "Рецензент дайындоо",
    noReviews: "Рецензиялар жок",
    daysLeft: "күн калды",
    daysOverdue: "күн кеч",
  },
  kk: {
    title: "Рецензияларды басқару",
    description: "Рецензияларды тағайындау және қадағалау",
    overview: "Шолу",
    pending: "Күтуде",
    inProgress: "Орындалуда",
    completed: "Аяқталды",
    overdue: "Мерзімі өтті",
    filterStatus: "Күй бойынша сүзу",
    allStatuses: "Барлық күйлер",
    article: "Мақала",
    reviewer: "Рецензент",
    assigned: "Тағайындалды",
    dueDate: "Мерзімі",
    status: "Күй",
    progress: "Прогресс",
    actions: "Әрекеттер",
    view: "Қарау",
    assignReviewer: "Рецензент тағайындау",
    noReviews: "Рецензиялар жоқ",
    daysLeft: "күн қалды",
    daysOverdue: "күн кешіктірілді",
  },
  tg: {
    title: "Идораи рецензияҳо",
    description: "Таъини рецензент ва пайгирии рецензияҳо",
    overview: "Намои умумӣ",
    pending: "Интизор",
    inProgress: "Дар ҷараён",
    completed: "Анҷомёфт",
    overdue: "Вақташ гузашт",
    filterStatus: "Филтр аз рӯи ҳолат",
    allStatuses: "Ҳамаи ҳолатҳо",
    article: "Мақола",
    reviewer: "Рецензент",
    assigned: "Таъин шуд",
    dueDate: "Мӯҳлат",
    status: "Ҳолат",
    progress: "Пешравӣ",
    actions: "Амалҳо",
    view: "Дидан",
    assignReviewer: "Таъини рецензент",
    noReviews: "Рецензияҳо нест",
    daysLeft: "рӯз мондааст",
    daysOverdue: "рӯз дертар",
  },
}

export default function ReviewersPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [articles, setArticles] = useState<MockArticle[]>([])
  const [users, setUsers] = useState<MockUser[]>([])
  const [reviews, setReviews] = useState<MockReview[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<MockReview | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  useEffect(() => {
    setArticles(getMockArticles())
    setUsers(getMockUsers())
    setReviews(getMockReviews())
  }, [])

  const filteredReviews = useMemo(() => {
    let result = [...reviews]

    if (statusFilter !== "all") {
      result = result.filter((review) => review.status === statusFilter)
    }

    return result.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
  }, [reviews, statusFilter])

  const stats = useMemo(() => {
    return {
      pending: reviews.filter((r) => r.status === "pending").length,
      inProgress: reviews.filter((r) => r.status === "in_progress").length,
      completed: reviews.filter((r) => r.status === "completed").length,
      overdue: reviews.filter((r) => r.status === "overdue").length,
    }
  }, [reviews])

  const getArticleById = (id: string) => articles.find((a) => a.id === id)
  const getUserById = (id: string) => users.find((u) => u.id === id)

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diff = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getStatusBadge = (status: MockReview["status"]) => {
    const config = {
      pending: { variant: "secondary" as const, icon: Clock, label: t.pending },
      in_progress: { variant: "outline" as const, icon: AlertCircle, label: t.inProgress },
      completed: { variant: "default" as const, icon: CheckCircle, label: t.completed },
      overdue: { variant: "destructive" as const, icon: XCircle, label: t.overdue },
    }
    const { variant, icon: Icon, label } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getProgressValue = (review: MockReview) => {
    if (review.status === "completed") return 100
    if (review.status === "overdue") return 100
    if (review.status === "in_progress") return 50
    return 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button onClick={() => setShowAssignModal(true)}>{t.assignReviewer}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pending}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.inProgress}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.completed}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.overdue}</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="pending">{t.pending}</SelectItem>
              <SelectItem value="in_progress">{t.inProgress}</SelectItem>
              <SelectItem value="completed">{t.completed}</SelectItem>
              <SelectItem value="overdue">{t.overdue}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.article}</TableHead>
                <TableHead>{t.reviewer}</TableHead>
                <TableHead>{t.assigned}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.progress}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {t.noReviews}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => {
                  const article = getArticleById(review.articleId)
                  const reviewer = getUserById(review.reviewerId)
                  const daysLeft = getDaysRemaining(review.dueDate)

                  return (
                    <TableRow key={review.id}>
                      <TableCell className="max-w-xs">
                        <div className="font-medium truncate">{article?.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reviewer?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{reviewer?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{reviewer?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(review.assignedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(review.dueDate).toLocaleDateString()}</div>
                          {review.status !== "completed" && (
                            <div
                              className={`text-xs ${daysLeft < 0 ? "text-destructive" : daysLeft < 3 ? "text-orange-500" : "text-muted-foreground"}`}
                            >
                              {daysLeft < 0 ? `${Math.abs(daysLeft)} ${t.daysOverdue}` : `${daysLeft} ${t.daysLeft}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell className="w-32">
                        <Progress value={getProgressValue(review)} className="h-2" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedReview(review)}>
                          {t.view}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAssignModal && (
        <AssignReviewerModal
          articles={articles.filter((a) => a.status === "pending")}
          reviewers={users.filter((u) => u.role === "reviewer")}
          open={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          onAssign={(articleId, reviewerId) => {
            const newReview: MockReview = {
              id: crypto.randomUUID(),
              articleId,
              reviewerId,
              assignedAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: "pending",
            }
            const updated = [...reviews, newReview]
            setReviews(updated)
            localStorage.setItem("mockReviews", JSON.stringify(updated))

            const updatedArticles = articles.map((a) =>
              a.id === articleId ? { ...a, status: "under_review" as const, reviewerId } : a,
            )
            setArticles(updatedArticles)
            localStorage.setItem("mockArticles", JSON.stringify(updatedArticles))

            setShowAssignModal(false)
            toast({
              title: "Success",
              description: "Reviewer assigned successfully",
            })
          }}
        />
      )}

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          article={getArticleById(selectedReview.articleId)!}
          reviewer={getUserById(selectedReview.reviewerId)!}
          open={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          onUpdate={(updatedReview) => {
            const updated = reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
            setReviews(updated)
            localStorage.setItem("mockReviews", JSON.stringify(updated))
            setSelectedReview(null)
            toast({
              title: "Success",
              description: "Review updated",
            })
          }}
        />
      )}
    </div>
  )
}
