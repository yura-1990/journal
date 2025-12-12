"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Download, Eye } from "lucide-react"
import { searchArticles, getAvailableYears, getAvailableFields, type SearchFilters } from "@/lib/search"
import { incrementArticleDownloads, downloadFile } from "@/lib/storage"
import { useLanguage } from "@/lib/language-context"
import { Breadcrumbs } from "@/components/breadcrumbs"
import Link from "next/link"

export default function SearchPage() {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams?.get("q") || "")
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get("q") || "",
    language: language,
  })
  const [results, setResults] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [availableFields, setAvailableFields] = useState<string[]>([])

  useEffect(() => {
    setAvailableYears(getAvailableYears())
    setAvailableFields(getAvailableFields())
  }, [])

  useEffect(() => {
    performSearch()
  }, [filters, language])

  const performSearch = () => {
    const searchResults = searchArticles({ ...filters, language })
    setResults(searchResults)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, query })
  }

  const clearFilters = () => {
    setQuery("")
    setFilters({ query: "", language })
  }

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters({ ...filters, [key]: undefined })
  }

  const handleDownload = (article: any) => {
    incrementArticleDownloads(article.id)
    downloadFile(article.fileData, article.fileName)
  }

  const translations = {
    uz: {
      title: "Qidiruv",
      searchPlaceholder: "Maqola, muallif yoki kalit so'zlarni qidiring...",
      searchButton: "Qidirish",
      filters: "Filtrlar",
      showFilters: "Filtrlarni ko'rsatish",
      hideFilters: "Filtrlarni yashirish",
      clearAll: "Hammasini tozalash",
      year: "Yil",
      field: "Fan sohasi",
      author: "Muallif",
      allYears: "Barcha yillar",
      allFields: "Barcha sohalar",
      results: "Natijalar",
      noResults: "Hech narsa topilmadi",
      showing: "Ko'rsatilmoqda",
      of: "dan",
      download: "Yuklash",
      view: "Ko'rish",
      views: "Ko'rishlar",
      downloads: "Yuklanishlar",
    },
    ru: {
      title: "Поиск",
      searchPlaceholder: "Поиск статей, авторов или ключевых слов...",
      searchButton: "Искать",
      filters: "Фильтры",
      showFilters: "Показать фильтры",
      hideFilters: "Скрыть фильтры",
      clearAll: "Очистить все",
      year: "Год",
      field: "Область науки",
      author: "Автор",
      allYears: "Все годы",
      allFields: "Все области",
      results: "Результаты",
      noResults: "Ничего не найдено",
      showing: "Показано",
      of: "из",
      download: "Скачать",
      view: "Просмотр",
      views: "Просмотры",
      downloads: "Загрузки",
    },
    en: {
      title: "Search",
      searchPlaceholder: "Search articles, authors or keywords...",
      searchButton: "Search",
      filters: "Filters",
      showFilters: "Show Filters",
      hideFilters: "Hide Filters",
      clearAll: "Clear All",
      year: "Year",
      field: "Field of Science",
      author: "Author",
      allYears: "All Years",
      allFields: "All Fields",
      results: "Results",
      noResults: "No results found",
      showing: "Showing",
      of: "of",
      download: "Download",
      view: "View",
      views: "Views",
      downloads: "Downloads",
    },
    ky: {
      title: "Издөө",
      searchPlaceholder: "Макалалар, авторлор же ачкыч сөздөрдү издөө...",
      searchButton: "Издөө",
      filters: "Чыпкалар",
      showFilters: "Чыпкаларды көрсөтүү",
      hideFilters: "Чыпкаларды жашыруу",
      clearAll: "Баарын тазалоо",
      year: "Жыл",
      field: "Илим тармагы",
      author: "Автор",
      allYears: "Бардык жылдар",
      allFields: "Бардык тармактар",
      results: "Натыйжалар",
      noResults: "Эч нерсе табылган жок",
      showing: "Көрсөтүлдү",
      of: "дан",
      download: "Жүктөө",
      view: "Көрүү",
      views: "Көрүүлөр",
      downloads: "Жүктөөлөр",
    },
    kk: {
      title: "Іздеу",
      searchPlaceholder: "Мақалалар, авторлар немесе кілт сөздерді іздеу...",
      searchButton: "Іздеу",
      filters: "Сүзгілер",
      showFilters: "Сүзгілерді көрсету",
      hideFilters: "Сүзгілерді жасыру",
      clearAll: "Барлығын тазалау",
      year: "Жыл",
      field: "Ғылым саласы",
      author: "Автор",
      allYears: "Барлық жылдар",
      allFields: "Барлық салалар",
      results: "Нәтижелер",
      noResults: "Ешнәрсе табылмады",
      showing: "Көрсетілді",
      of: "дан",
      download: "Жүктеу",
      view: "Көру",
      views: "Көрулер",
      downloads: "Жүктеулер",
    },
    tg: {
      title: "Ҷустуҷӯ",
      searchPlaceholder: "Ҷустуҷӯи мақолаҳо, муаллифон ё калимаҳои калидӣ...",
      searchButton: "Ҷустуҷӯ",
      filters: "Филтрҳо",
      showFilters: "Намоиш додани филтрҳо",
      hideFilters: "Пинҳон кардани филтрҳо",
      clearAll: "Ҳамаро тоза кардан",
      year: "Сол",
      field: "Соҳаи илм",
      author: "Муаллиф",
      allYears: "Ҳамаи солҳо",
      allFields: "Ҳамаи соҳаҳо",
      results: "Натиҷаҳо",
      noResults: "Ҳеҷ чиз ёфт нашуд",
      showing: "Нишон дода шуд",
      of: "аз",
      download: "Боргирӣ",
      view: "Дидан",
      views: "Дидан",
      downloads: "Боргириҳо",
    },
  }[language]

  const activeFiltersCount = (filters.year ? 1 : 0) + (filters.field ? 1 : 0) + (filters.author ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: t.home, href: "/" }, { label: translations.title }]} />

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">{translations.title}</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={translations.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">{translations.searchButton}</Button>
            <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? translations.hideFilters : translations.showFilters}
              {activeFiltersCount > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </form>

        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{translations.filters}</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {translations.clearAll}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">{translations.year}</label>
                  <Select
                    value={filters.year || "allYears"}
                    onValueChange={(value) =>
                      setFilters({ ...filters, year: value === "allYears" ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={translations.allYears} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allYears">{translations.allYears}</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{translations.field}</label>
                  <Select
                    value={filters.field || "allFields"}
                    onValueChange={(value) =>
                      setFilters({ ...filters, field: value === "allFields" ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={translations.allFields} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allFields">{translations.allFields}</SelectItem>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{translations.author}</label>
                  <Input
                    placeholder={translations.author}
                    value={filters.author || ""}
                    onChange={(e) => setFilters({ ...filters, author: e.target.value || undefined })}
                  />
                </div>
              </div>

              {(filters.year || filters.field || filters.author) && (
                <div className="flex flex-wrap gap-2">
                  {filters.year && (
                    <Badge variant="secondary">
                      {translations.year}: {filters.year}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeFilter("year")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.field && (
                    <Badge variant="secondary">
                      {translations.field}: {filters.field}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeFilter("field")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {filters.author && (
                    <Badge variant="secondary">
                      {translations.author}: {filters.author}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeFilter("author")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mb-4 text-sm text-muted-foreground">
          {translations.showing} {results.length} {translations.results}
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{translations.noResults}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const article = result.article
              const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)
              const title = article[`title${langSuffix}`] || article.titleEn
              const author = article[`authorName${langSuffix}`] || article.authorNameEn
              const keywords = article[`keywords${langSuffix}`] || article.keywordsEn

              return (
                <Card key={article.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription className="mt-2">
                          <div className="space-y-1">
                            <p className="font-semibold">{author}</p>
                            <p className="text-sm">{article.workplaceEn}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{article.fieldOfScience}</Badge>
                              <Badge variant="secondary">{new Date(article.submittedAt).getFullYear()}</Badge>
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{keywords}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views || 0} {translations.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {article.downloads || 0} {translations.downloads}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(article)}>
                          <Download className="mr-2 h-4 w-4" />
                          {translations.download}
                        </Button>
                        <Button size="sm" variant="default" asChild>
                          <Link href={`/articles/${article.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            {translations.view}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
