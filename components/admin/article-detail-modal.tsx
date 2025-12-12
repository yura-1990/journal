"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language-context"
import type { MockArticle } from "@/lib/mock-data"
import { Download, CheckCircle, XCircle, Trash2, User, Mail } from "lucide-react"

interface ArticleDetailModalProps {
  article: MockArticle
  open: boolean
  onClose: () => void
  onStatusChange: (status: MockArticle["status"]) => void
  onDelete: () => void
}

const translations = {
  uz: {
    details: "Maqola tafsilotlari",
    title: "Sarlavha",
    authors: "Mualliflar",
    email: "Email",
    abstract: "Annotatsiya",
    keywords: "Kalit so'zlar",
    field: "Soha",
    status: "Status",
    submitted: "Yuborilgan",
    views: "Ko'rishlar",
    downloads: "Yuklab olishlar",
    citations: "Iqtiboslar",
    fileName: "Fayl nomi",
    fileSize: "Fayl hajmi",
    doi: "DOI",
    reviewerComments: "Taqrizchi izohlari",
    reviewScore: "Taqriz bali",
    actions: "Harakatlar",
    approve: "Tasdiqlash",
    reject: "Rad etish",
    delete: "O'chirish",
    download: "Yuklab olish",
    close: "Yopish",
    pending: "Kutilmoqda",
    under_review: "Ko'rib chiqilmoqda",
    revision_required: "Tuzatish kerak",
    accepted: "Qabul qilindi",
    rejected: "Rad etildi",
    published: "Nashr etildi",
  },
  ru: {
    details: "Детали статьи",
    title: "Название",
    authors: "Авторы",
    email: "Email",
    abstract: "Аннотация",
    keywords: "Ключевые слова",
    field: "Область",
    status: "Статус",
    submitted: "Подано",
    views: "Просмотры",
    downloads: "Скачивания",
    citations: "Цитирования",
    fileName: "Имя файла",
    fileSize: "Размер файла",
    doi: "DOI",
    reviewerComments: "Комментарии рецензента",
    reviewScore: "Оценка рецензии",
    actions: "Действия",
    approve: "Одобрить",
    reject: "Отклонить",
    delete: "Удалить",
    download: "Скачать",
    close: "Закрыть",
    pending: "Ожидает",
    under_review: "На рецензии",
    revision_required: "Требуется правка",
    accepted: "Принято",
    rejected: "Отклонено",
    published: "Опубликовано",
  },
  en: {
    details: "Article Details",
    title: "Title",
    authors: "Authors",
    email: "Email",
    abstract: "Abstract",
    keywords: "Keywords",
    field: "Field",
    status: "Status",
    submitted: "Submitted",
    views: "Views",
    downloads: "Downloads",
    citations: "Citations",
    fileName: "File Name",
    fileSize: "File Size",
    doi: "DOI",
    reviewerComments: "Reviewer Comments",
    reviewScore: "Review Score",
    actions: "Actions",
    approve: "Approve",
    reject: "Reject",
    delete: "Delete",
    download: "Download",
    close: "Close",
    pending: "Pending",
    under_review: "Under Review",
    revision_required: "Revision Required",
    accepted: "Accepted",
    rejected: "Rejected",
    published: "Published",
  },
  ky: {
    details: "Макала тафсилотлары",
    title: "Аталышы",
    authors: "Авторлор",
    email: "Email",
    abstract: "Аннотация",
    keywords: "Ачкыч сөздөр",
    field: "Тармак",
    status: "Статус",
    submitted: "Жөнөтүлдү",
    views: "Көрүүлөр",
    downloads: "Жүктөөлөр",
    citations: "Шилтемелер",
    fileName: "Файл аты",
    fileSize: "Файл өлчөмү",
    doi: "DOI",
    reviewerComments: "Рецензенттин комментарийлери",
    reviewScore: "Рецензия балы",
    actions: "Аракеттер",
    approve: "Бекитүү",
    reject: "Четке кагуу",
    delete: "Өчүрүү",
    download: "Жүктөө",
    close: "Жабуу",
    pending: "Күтүлүүдө",
    under_review: "Каралууда",
    revision_required: "Оңдоо керек",
    accepted: "Кабыл алынды",
    rejected: "Четке кагылды",
    published: "Жарыяланды",
  },
  kk: {
    details: "Мақала мәліметтері",
    title: "Атауы",
    authors: "Авторлар",
    email: "Email",
    abstract: "Аннотация",
    keywords: "Кілт сөздер",
    field: "Сала",
    status: "Мәртебе",
    submitted: "Жіберілді",
    views: "Қараулар",
    downloads: "Жүктеулер",
    citations: "Сілтемелер",
    fileName: "Файл аты",
    fileSize: "Файл өлшемі",
    doi: "DOI",
    reviewerComments: "Рецензенттің пікірлері",
    reviewScore: "Рецензия балы",
    actions: "Әрекеттер",
    approve: "Мақұлдау",
    reject: "Қабылдамау",
    delete: "Жою",
    download: "Жүктеу",
    close: "Жабу",
    pending: "Күтуде",
    under_review: "Қаралуда",
    revision_required: "Түзету қажет",
    accepted: "Қабылданды",
    rejected: "Қабылданбады",
    published: "Жарияланды",
  },
  tg: {
    details: "Тафсилоти мақола",
    title: "Сарлавҳа",
    authors: "Муаллифон",
    email: "Email",
    abstract: "Аннотатсия",
    keywords: "Калидвожаҳо",
    field: "Соҳа",
    status: "Ҳолат",
    submitted: "Ирсолшуд",
    views: "Дидан",
    downloads: "Боргириҳо",
    citations: "Иқтибосҳо",
    fileName: "Номи файл",
    fileSize: "Ҳаҷми файл",
    doi: "DOI",
    reviewerComments: "Шарҳҳои рецензент",
    reviewScore: "Баллҳои рецензия",
    actions: "Амалҳо",
    approve: "Тасдиқ кардан",
    reject: "Рад кардан",
    delete: "Нест кардан",
    download: "Боргирӣ кардан",
    close: "Пӯшидан",
    pending: "Интизор",
    under_review: "Дар баррасӣ",
    revision_required: "Ислоҳ лозим аст",
    accepted: "Қабул шуд",
    rejected: "Рад шуд",
    published: "Нашршуд",
  },
}

export function ArticleDetailModal({ article, open, onClose, onStatusChange, onDelete }: ArticleDetailModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const getStatusBadge = (status: MockArticle["status"]) => {
    const variants: Record<MockArticle["status"], "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      under_review: "outline",
      revision_required: "outline",
      accepted: "default",
      rejected: "destructive",
      published: "default",
    }
    return <Badge variant={variants[status]}>{t[status as keyof typeof t] || status}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.details}</DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground mt-2">{article.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t.status}:</span>
            {getStatusBadge(article.status)}
          </div>

          <Separator />

          {/* Authors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              {t.authors}
            </div>
            <div className="text-sm text-muted-foreground">{article.authors.join(", ")}</div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              {t.email}
            </div>
            <div className="text-sm text-muted-foreground">{article.email}</div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-sm font-medium">{t.abstract}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{article.abstract}</div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <div className="text-sm font-medium">{t.keywords}</div>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium mb-1">{t.field}</div>
              <Badge variant="outline">{article.field}</Badge>
            </div>
            <div>
              <div className="font-medium mb-1">{t.submitted}</div>
              <div className="text-muted-foreground">{new Date(article.submittedAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="font-medium mb-1">{t.views}</div>
              <div className="text-muted-foreground">{article.views}</div>
            </div>
            <div>
              <div className="font-medium mb-1">{t.downloads}</div>
              <div className="text-muted-foreground">{article.downloads}</div>
            </div>
            {article.citations > 0 && (
              <div>
                <div className="font-medium mb-1">{t.citations}</div>
                <div className="text-muted-foreground">{article.citations}</div>
              </div>
            )}
            {article.doi && (
              <div>
                <div className="font-medium mb-1">{t.doi}</div>
                <div className="text-muted-foreground text-xs break-all">{article.doi}</div>
              </div>
            )}
          </div>

          {/* File Info */}
          {article.fileName && (
            <div className="space-y-2">
              <div className="text-sm font-medium">{t.fileName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{article.fileName}</span>
                <span>•</span>
                <span>{article.fileSize}</span>
              </div>
            </div>
          )}

          {/* Reviewer Comments */}
          {article.reviewerComments && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">{t.reviewerComments}</div>
                <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">{article.reviewerComments}</div>
                {article.reviewScore && (
                  <div className="text-sm">
                    <span className="font-medium">{t.reviewScore}:</span> {article.reviewScore}/10
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {article.status === "pending" && (
              <>
                <Button onClick={() => onStatusChange("accepted")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t.approve}
                </Button>
                <Button variant="outline" onClick={() => onStatusChange("rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  {t.reject}
                </Button>
              </>
            )}
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t.download}
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t.delete}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
