"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language-context"
import type { MockArticle, MockUser, MockReview } from "@/lib/mock-data"
import { useState, useEffect } from "react"

interface ReviewDetailModalProps {
  review: MockReview
  article: MockArticle
  reviewer: MockUser
  open: boolean
  onClose: () => void
  onUpdate: (review: MockReview) => void
}

const translations = {
  uz: {
    title: "Taqriz tafsilotlari",
    article: "Maqola",
    reviewer: "Taqrizchi",
    assigned: "Tayinlandi",
    dueDate: "Muddati",
    status: "Status",
    recommendation: "Tavsiya",
    score: "Ball",
    comments: "Izohlar",
    pending: "Kutilmoqda",
    in_progress: "Jarayonda",
    completed: "Yakunlandi",
    overdue: "Muddati o'tgan",
    accept: "Qabul qilish",
    minor_revision: "Kichik tuzatish",
    major_revision: "Katta tuzatish",
    reject: "Rad etish",
    update: "Yangilash",
    cancel: "Bekor qilish",
  },
  ru: {
    title: "Детали рецензии",
    article: "Статья",
    reviewer: "Рецензент",
    assigned: "Назначено",
    dueDate: "Срок",
    status: "Статус",
    recommendation: "Рекомендация",
    score: "Оценка",
    comments: "Комментарии",
    pending: "Ожидает",
    in_progress: "В процессе",
    completed: "Завершено",
    overdue: "Просрочено",
    accept: "Принять",
    minor_revision: "Незначительные правки",
    major_revision: "Значительные правки",
    reject: "Отклонить",
    update: "Обновить",
    cancel: "Отмена",
  },
  en: {
    title: "Review Details",
    article: "Article",
    reviewer: "Reviewer",
    assigned: "Assigned",
    dueDate: "Due Date",
    status: "Status",
    recommendation: "Recommendation",
    score: "Score",
    comments: "Comments",
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
    accept: "Accept",
    minor_revision: "Minor Revision",
    major_revision: "Major Revision",
    reject: "Reject",
    update: "Update",
    cancel: "Cancel",
  },
  ky: {
    title: "Рецензия тафсилаттары",
    article: "Макала",
    reviewer: "Рецензент",
    assigned: "Дайындалды",
    dueDate: "Мөөнөтү",
    status: "Статус",
    recommendation: "Сунуш",
    score: "Упай",
    comments: "Комментарийлер",
    pending: "Күтүүдө",
    in_progress: "Иштөөдө",
    completed: "Аяктады",
    overdue: "Мөөнөтү өттү",
    accept: "Кабыл алуу",
    minor_revision: "Кичине оңдоо",
    major_revision: "Чоң оңдоо",
    reject: "Четке кагуу",
    update: "Жаңыртуу",
    cancel: "Жокко чыгаруу",
  },
  kk: {
    title: "Рецензия мәліметтері",
    article: "Мақала",
    reviewer: "Рецензент",
    assigned: "Тағайындалды",
    dueDate: "Мерзімі",
    status: "Күй",
    recommendation: "Ұсыныс",
    score: "Баға",
    comments: "Пікірлер",
    pending: "Күтуде",
    in_progress: "Орындалуда",
    completed: "Аяқталды",
    overdue: "Мерзімі өтті",
    accept: "Қабылдау",
    minor_revision: "Шағын түзету",
    major_revision: "Үлкен түзету",
    reject: "Қабылдамау",
    update: "Жаңарту",
    cancel: "Болдырмау",
  },
  tg: {
    title: "Тафсилоти рецензия",
    article: "Мақола",
    reviewer: "Рецензент",
    assigned: "Таъин шуд",
    dueDate: "Мӯҳлат",
    status: "Ҳолат",
    recommendation: "Тавсия",
    score: "Балл",
    comments: "Шарҳҳо",
    pending: "Интизор",
    in_progress: "Дар ҷараён",
    completed: "Анҷомёфт",
    overdue: "Вақташ гузашт",
    accept: "Қабул кардан",
    minor_revision: "Ислоҳи хурд",
    major_revision: "Ислоҳи калон",
    reject: "Рад кардан",
    update: "Нав кардан",
    cancel: "Бекор кардан",
  },
}

export function ReviewDetailModal({ review, article, reviewer, open, onClose, onUpdate }: ReviewDetailModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const [formData, setFormData] = useState({
    status: review.status,
    score: review.score || 5,
    comments: review.comments || "",
    recommendation: review.recommendation || "minor_revision",
  })

  useEffect(() => {
    setFormData({
      status: review.status,
      score: review.score || 5,
      comments: review.comments || "",
      recommendation: review.recommendation || "minor_revision",
    })
  }, [review])

  const handleSubmit = () => {
    const updatedReview: MockReview = {
      ...review,
      status: formData.status,
      score: formData.score,
      comments: formData.comments,
      recommendation: formData.recommendation as any,
      completedAt: formData.status === "completed" ? new Date().toISOString() : review.completedAt,
    }
    onUpdate(updatedReview)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.article}</Label>
            <div className="rounded-lg border p-3 text-sm">{article.title}</div>
          </div>

          <div className="space-y-2">
            <Label>{t.reviewer}</Label>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reviewer.avatar || "/placeholder.svg"} />
                <AvatarFallback>{reviewer.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{reviewer.name}</div>
                <div className="text-xs text-muted-foreground">{reviewer.email}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">{t.assigned}</Label>
              <div>{new Date(review.assignedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">{t.dueDate}</Label>
              <div>{new Date(review.dueDate).toLocaleDateString()}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="in_progress">{t.in_progress}</SelectItem>
                <SelectItem value="completed">{t.completed}</SelectItem>
                <SelectItem value="overdue">{t.overdue}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.recommendation}</Label>
            <Select
              value={formData.recommendation}
              onValueChange={(value) => setFormData({ ...formData, recommendation: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">{t.accept}</SelectItem>
                <SelectItem value="minor_revision">{t.minor_revision}</SelectItem>
                <SelectItem value="major_revision">{t.major_revision}</SelectItem>
                <SelectItem value="reject">{t.reject}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {t.score} (1-10): {formData.score}
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number.parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.comments}</Label>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={5}
              placeholder="Enter review comments..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit}>{t.update}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
