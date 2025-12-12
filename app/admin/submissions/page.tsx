"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Trash2, Eye, CheckCircle, XCircle, FileText } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getMockArticles, type MockArticle } from "@/lib/mock-data"
import { ArticleDetailModal } from "@/components/admin/article-detail-modal"
import { useToast } from "@/hooks/use-toast"

const translations = {
  uz: {
    title: "Yuborilgan maqolalar",
    description: "Yuborilgan maqolalarni ko'rib chiqish va boshqarish",
    search: "Qidirish...",
    filterStatus: "Status bo'yicha filtrlash",
    filterField: "Soha bo'yicha filtrlash",
    allStatuses: "Barcha statuslar",
    allFields: "Barcha sohalar",
    sort: "Saralash",
    newest: "Eng yangilari",
    oldest: "Eng eskilari",
    selectAll: "Hammasini tanlash",
    selected: "tanlandi",
    deleteSelected: "Tanlanganlarni o'chirish",
    approveSelected: "Tanlanganlarni tasdiqlash",
    rejectSelected: "Tanlanganlarni rad etish",
    title_col: "Sarlavha",
    author: "Muallif",
    field: "Soha",
    status: "Status",
    submitted: "Yuborilgan",
    actions: "Harakatlar",
    view: "Ko'rish",
    approve: "Tasdiqlash",
    reject: "Rad etish",
    delete: "O'chirish",
    noResults: "Natijalar topilmadi",
    pending: "Kutilmoqda",
    under_review: "Ko'rib chiqilmoqda",
    revision_required: "Tuzatish kerak",
    accepted: "Qabul qilindi",
    rejected: "Rad etildi",
    published: "Nashr etildi",
  },
  ru: {
    title: "Поданные статьи",
    description: "Просмотр и управление поданными статьями",
    search: "Поиск...",
    filterStatus: "Фильтр по статусу",
    filterField: "Фильтр по области",
    allStatuses: "Все статусы",
    allFields: "Все области",
    sort: "Сортировка",
    newest: "Сначала новые",
    oldest: "Сначала старые",
    selectAll: "Выбрать все",
    selected: "выбрано",
    deleteSelected: "Удалить выбранные",
    approveSelected: "Одобрить выбранные",
    rejectSelected: "Отклонить выбранные",
    title_col: "Название",
    author: "Автор",
    field: "Область",
    status: "Статус",
    submitted: "Подано",
    actions: "Действия",
    view: "Просмотр",
    approve: "Одобрить",
    reject: "Отклонить",
    delete: "Удалить",
    noResults: "Результаты не найдены",
    pending: "Ожидает",
    under_review: "На рецензии",
    revision_required: "Требуется правка",
    accepted: "Принято",
    rejected: "Отклонено",
    published: "Опубликовано",
  },
  en: {
    title: "Article Submissions",
    description: "Review and manage submitted articles",
    search: "Search...",
    filterStatus: "Filter by status",
    filterField: "Filter by field",
    allStatuses: "All statuses",
    allFields: "All fields",
    sort: "Sort by",
    newest: "Newest first",
    oldest: "Oldest first",
    selectAll: "Select all",
    selected: "selected",
    deleteSelected: "Delete selected",
    approveSelected: "Approve selected",
    rejectSelected: "Reject selected",
    title_col: "Title",
    author: "Author",
    field: "Field",
    status: "Status",
    submitted: "Submitted",
    actions: "Actions",
    view: "View",
    approve: "Approve",
    reject: "Reject",
    delete: "Delete",
    noResults: "No results found",
    pending: "Pending",
    under_review: "Under Review",
    revision_required: "Revision Required",
    accepted: "Accepted",
    rejected: "Rejected",
    published: "Published",
  },
  ky: {
    title: "Жөнөтүлгөн макалалар",
    description: "Жөнөтүлгөн макалаларды карап чыгуу жана башкаруу",
    search: "Издөө...",
    filterStatus: "Статус боюнча чыпкалоо",
    filterField: "Тармак боюнча чыпкалоо",
    allStatuses: "Бардык статустар",
    allFields: "Бардык тармактар",
    sort: "Иреттөө",
    newest: "Эң жаңылар",
    oldest: "Эң эскилер",
    selectAll: "Баарын тандоо",
    selected: "тандалды",
    deleteSelected: "Тандалгандарды өчүрүү",
    approveSelected: "Тандалгандарды бекитүү",
    rejectSelected: "Тандалгандарды четке кагуу",
    title_col: "Аталышы",
    author: "Автор",
    field: "Тармак",
    status: "Статус",
    submitted: "Жөнөтүлдү",
    actions: "Аракеттер",
    view: "Көрүү",
    approve: "Бекитүү",
    reject: "Четке кагуу",
    delete: "Өчүрүү",
    noResults: "Натыйжалар табылган жок",
    pending: "Күтүлүүдө",
    under_review: "Каралууда",
    revision_required: "Оңдоо керек",
    accepted: "Кабыл алынды",
    rejected: "Четке кагылды",
    published: "Жарыяланды",
  },
  kk: {
    title: "Жіберілген мақалалар",
    description: "Жіберілген мақалаларды қарау және басқару",
    search: "Іздеу...",
    filterStatus: "Мәртебе бойынша сүзу",
    filterField: "Сала бойынша сүзу",
    allStatuses: "Барлық мәртебелер",
    allFields: "Барлық салалар",
    sort: "Сұрыптау",
    newest: "Ең жаңалар",
    oldest: "Ең ескілер",
    selectAll: "Барлығын таңдау",
    selected: "таңдалды",
    deleteSelected: "Таңдалғандарды жою",
    approveSelected: "Таңдалғандарды мақұлдау",
    rejectSelected: "Таңдалғандарды қабылдамау",
    title_col: "Атауы",
    author: "Автор",
    field: "Сала",
    status: "Мәртебе",
    submitted: "Жіберілді",
    actions: "Әрекеттер",
    view: "Қарау",
    approve: "Мақұлдау",
    reject: "Қабылдамау",
    delete: "Жою",
    noResults: "Нәтижелер табылмады",
    pending: "Күтуде",
    under_review: "Қаралуда",
    revision_required: "Түзету қажет",
    accepted: "Қабылданды",
    rejected: "Қабылданбады",
    published: "Жарияланды",
  },
  tg: {
    title: "Мақолаҳои ирсолшуда",
    description: "Баррасӣ ва идораи мақолаҳои ирсолшуда",
    search: "Ҷустуҷӯ...",
    filterStatus: "Филтр аз рӯи ҳолат",
    filterField: "Филтр аз рӯи соҳа",
    allStatuses: "Ҳамаи ҳолатҳо",
    allFields: "Ҳамаи соҳаҳо",
    sort: "Тартиб",
    newest: "Аввал навтарин",
    oldest: "Аввал кӯҳнатарин",
    selectAll: "Ҳамаро интихоб кардан",
    selected: "интихобшуда",
    deleteSelected: "Интихобшударо нест кардан",
    approveSelected: "Интихобшударо тасдиқ кардан",
    rejectSelected: "Интихобшударо рад кардан",
    title_col: "Сарлавҳа",
    author: "Муаллиф",
    field: "Соҳа",
    status: "Ҳолат",
    submitted: "Ирсолшуд",
    actions: "Амалҳо",
    view: "Дидан",
    approve: "Тасдиқ кардан",
    reject: "Рад кардан",
    delete: "Нест кардан",
    noResults: "Натиҷаҳо ёфт нашуданд",
    pending: "Интизор",
    under_review: "Дар баррасӣ",
    revision_required: "Ислоҳ лозим аст",
    accepted: "Қабул шуд",
    rejected: "Рад шуд",
    published: "Нашршуд",
  },
}

export default function SubmissionsPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [articles, setArticles] = useState<MockArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [fieldFilter, setFieldFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedArticle, setSelectedArticle] = useState<MockArticle | null>(null)

  useEffect(() => {
    const mockArticles = getMockArticles()
    setArticles(mockArticles)
  }, [])

  const filteredArticles = useMemo(() => {
    let result = [...articles]

    // Search
    if (searchQuery) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
          article.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((article) => article.status === statusFilter)
    }

    // Field filter
    if (fieldFilter !== "all") {
      result = result.filter((article) => article.field === fieldFilter)
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime()
      const dateB = new Date(b.submittedAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return result
  }, [articles, searchQuery, statusFilter, fieldFilter, sortOrder])

  const uniqueFields = useMemo(() => {
    return Array.from(new Set(articles.map((a) => a.field)))
  }, [articles])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredArticles.map((a) => a.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Delete ${selectedIds.size} articles?`)) return

    const updated = articles.filter((a) => !selectedIds.has(a.id))
    setArticles(updated)
    localStorage.setItem("mockArticles", JSON.stringify(updated))
    setSelectedIds(new Set())
    toast({
      title: "Success",
      description: `${selectedIds.size} articles deleted`,
    })
  }

  const handleBulkStatusChange = (status: MockArticle["status"]) => {
    if (selectedIds.size === 0) return

    const updated = articles.map((a) => (selectedIds.has(a.id) ? { ...a, status } : a))
    setArticles(updated)
    localStorage.setItem("mockArticles", JSON.stringify(updated))
    setSelectedIds(new Set())
    toast({
      title: "Success",
      description: `${selectedIds.size} articles updated`,
    })
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="under_review">{t.under_review}</SelectItem>
                <SelectItem value="revision_required">{t.revision_required}</SelectItem>
                <SelectItem value="accepted">{t.accepted}</SelectItem>
                <SelectItem value="rejected">{t.rejected}</SelectItem>
                <SelectItem value="published">{t.published}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t.filterField} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allFields}</SelectItem>
                {uniqueFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.newest}</SelectItem>
                <SelectItem value="oldest">{t.oldest}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium">
                {selectedIds.size} {t.selected}
              </span>
              <Button size="sm" variant="default" onClick={() => handleBulkStatusChange("accepted")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t.approveSelected}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("rejected")}>
                <XCircle className="mr-2 h-4 w-4" />
                {t.rejectSelected}
              </Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t.deleteSelected}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === filteredArticles.length && filteredArticles.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t.title_col}</TableHead>
                <TableHead>{t.author}</TableHead>
                <TableHead>{t.field}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.submitted}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <p>{t.noResults}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(article.id)}
                        onCheckedChange={(checked) => handleSelectOne(article.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{article.title}</TableCell>
                    <TableCell>{article.authors[0]}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.field}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>{new Date(article.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedArticle(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          open={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onStatusChange={(status) => {
            const updated = articles.map((a) => (a.id === selectedArticle.id ? { ...a, status } : a))
            setArticles(updated)
            localStorage.setItem("mockArticles", JSON.stringify(updated))
            setSelectedArticle(null)
            toast({
              title: "Success",
              description: "Article status updated",
            })
          }}
          onDelete={() => {
            const updated = articles.filter((a) => a.id !== selectedArticle.id)
            setArticles(updated)
            localStorage.setItem("mockArticles", JSON.stringify(updated))
            setSelectedArticle(null)
            toast({
              title: "Success",
              description: "Article deleted",
            })
          }}
        />
      )}
    </div>
  )
}
