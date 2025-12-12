"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/lib/language-context"
import type { MockArticle, MockUser } from "@/lib/mock-data"
import { useState } from "react"

interface AssignReviewerModalProps {
  articles: MockArticle[]
  reviewers: MockUser[]
  open: boolean
  onClose: () => void
  onAssign: (articleId: string, reviewerId: string) => void
}

const translations = {
  uz: {
    title: "Taqrizchi tayinlash",
    selectArticle: "Maqolani tanlang",
    selectReviewer: "Taqrizchini tanlang",
    articles: "Maqolalar",
    reviewsCount: "Taqrizlar soni",
    assign: "Tayinlash",
    cancel: "Bekor qilish",
  },
  ru: {
    title: "Назначить рецензента",
    selectArticle: "Выберите статью",
    selectReviewer: "Выберите рецензента",
    articles: "Статьи",
    reviewsCount: "Количество рецензий",
    assign: "Назначить",
    cancel: "Отмена",
  },
  en: {
    title: "Assign Reviewer",
    selectArticle: "Select Article",
    selectReviewer: "Select Reviewer",
    articles: "Articles",
    reviewsCount: "Reviews Count",
    assign: "Assign",
    cancel: "Cancel",
  },
  ky: {
    title: "Рецензент дайындоо",
    selectArticle: "Макаланы тандаңыз",
    selectReviewer: "Рецензентти тандаңыз",
    articles: "Макалалар",
    reviewsCount: "Рецензиялар саны",
    assign: "Дайындоо",
    cancel: "Жокко чыгаруу",
  },
  kk: {
    title: "Рецензент тағайындау",
    selectArticle: "Мақаланы таңдаңыз",
    selectReviewer: "Рецензентті таңдаңыз",
    articles: "Мақалалар",
    reviewsCount: "Рецензиялар саны",
    assign: "Тағайындау",
    cancel: "Болдырмау",
  },
  tg: {
    title: "Таъини рецензент",
    selectArticle: "Мақоларо интихоб кунед",
    selectReviewer: "Рецензентро интихоб кунед",
    articles: "Мақолаҳо",
    reviewsCount: "Шумораи рецензияҳо",
    assign: "Таъин кардан",
    cancel: "Бекор кардан",
  },
}

export function AssignReviewerModal({ articles, reviewers, open, onClose, onAssign }: AssignReviewerModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const [selectedArticle, setSelectedArticle] = useState("")
  const [selectedReviewer, setSelectedReviewer] = useState("")

  const handleSubmit = () => {
    if (selectedArticle && selectedReviewer) {
      onAssign(selectedArticle, selectedReviewer)
      setSelectedArticle("")
      setSelectedReviewer("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.selectArticle}</Label>
            <Select value={selectedArticle} onValueChange={setSelectedArticle}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectArticle} />
              </SelectTrigger>
              <SelectContent>
                {articles.map((article) => (
                  <SelectItem key={article.id} value={article.id}>
                    <div className="max-w-sm truncate">{article.title}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.selectReviewer}</Label>
            <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectReviewer} />
              </SelectTrigger>
              <SelectContent>
                {reviewers.map((reviewer) => (
                  <SelectItem key={reviewer.id} value={reviewer.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reviewer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{reviewer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{reviewer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {reviewer.reviewsCount} {t.reviewsCount}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedArticle || !selectedReviewer}>
              {t.assign}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
