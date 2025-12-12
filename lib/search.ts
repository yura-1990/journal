// Advanced search and filtering utilities
import { getArticles, type Article, logSearch } from "./storage"

export interface SearchFilters {
  query?: string
  field?: string
  year?: string
  author?: string
  status?: Article["status"]
  language?: "uz" | "ru" | "en" | "ky" | "kk" | "tg"
}

export interface SearchResult {
  article: Article
  relevance: number
  matchedFields: string[]
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

function calculateRelevance(article: Article, query: string, language: string): number {
  let score = 0
  const normalizedQuery = normalizeText(query)
  const queryWords = normalizedQuery.split(/\s+/)

  // Helper function to check text match
  const checkMatch = (text: string, weight: number): number => {
    if (!text) return 0
    const normalizedText = normalizeText(text)
    let matchScore = 0

    // Exact phrase match
    if (normalizedText.includes(normalizedQuery)) {
      matchScore += weight * 2
    }

    // Individual word matches
    queryWords.forEach((word) => {
      if (normalizedText.includes(word)) {
        matchScore += weight
      }
    })

    return matchScore
  }

  // Title matches (highest weight)
  score += checkMatch(
    article[`title${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Article] as string,
    10,
  )

  // Keywords matches
  score += checkMatch(
    article[`keywords${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Article] as string,
    8,
  )

  // Author name matches
  score += checkMatch(
    article[`authorName${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Article] as string,
    5,
  )

  // Field of science
  score += checkMatch(article.fieldOfScience, 3)

  // Workplace
  score += checkMatch(
    article[`workplace${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Article] as string,
    2,
  )

  return score
}

function getMatchedFields(article: Article, query: string, language: string): string[] {
  const matched: string[] = []
  const normalizedQuery = normalizeText(query)

  const checkField = (text: string, fieldName: string) => {
    if (text && normalizeText(text).includes(normalizedQuery)) {
      matched.push(fieldName)
    }
  }

  const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)

  checkField(article[`title${langSuffix}` as keyof Article] as string, "title")
  checkField(article[`keywords${langSuffix}` as keyof Article] as string, "keywords")
  checkField(article[`authorName${langSuffix}` as keyof Article] as string, "author")
  checkField(article.fieldOfScience, "field")

  return matched
}

export function searchArticles(filters: SearchFilters): SearchResult[] {
  let articles = getArticles()

  // Apply status filter first
  if (filters.status) {
    articles = articles.filter((a) => a.status === filters.status)
  } else {
    // By default, only show published or approved articles
    articles = articles.filter((a) => a.status === "published" || a.status === "approved")
  }

  // Apply year filter
  if (filters.year) {
    articles = articles.filter((a) => {
      const year = new Date(a.submittedAt).getFullYear().toString()
      return year === filters.year
    })
  }

  // Apply field filter
  if (filters.field) {
    articles = articles.filter((a) => a.fieldOfScience.toLowerCase() === filters.field.toLowerCase())
  }

  // Apply author filter
  if (filters.author) {
    const authorQuery = normalizeText(filters.author)
    articles = articles.filter((a) => {
      return (
        normalizeText(a.authorNameUz).includes(authorQuery) ||
        normalizeText(a.authorNameRu).includes(authorQuery) ||
        normalizeText(a.authorNameEn).includes(authorQuery) ||
        (a.authorNameKy && normalizeText(a.authorNameKy).includes(authorQuery)) ||
        (a.authorNameKk && normalizeText(a.authorNameKk).includes(authorQuery)) ||
        (a.authorNameTg && normalizeText(a.authorNameTg).includes(authorQuery))
      )
    })
  }

  // Apply text search query
  let results: SearchResult[]

  if (filters.query && filters.query.trim()) {
    const language = filters.language || "en"

    results = articles
      .map((article) => {
        const relevance = calculateRelevance(article, filters.query!, language)
        const matchedFields = getMatchedFields(article, filters.query!, language)

        return {
          article,
          relevance,
          matchedFields,
        }
      })
      .filter((result) => result.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)

    // Log search query
    logSearch(filters.query, { field: filters.field, year: filters.year, author: filters.author }, results.length)
  } else {
    // No query, just return filtered articles sorted by date
    results = articles
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .map((article) => ({
        article,
        relevance: 0,
        matchedFields: [],
      }))
  }

  return results
}

export function getAvailableYears(): string[] {
  const articles = getArticles()
  const years = new Set<string>()

  articles.forEach((article) => {
    const year = new Date(article.submittedAt).getFullYear().toString()
    years.add(year)
  })

  return Array.from(years).sort((a, b) => Number(b) - Number(a))
}

export function getAvailableFields(): string[] {
  const articles = getArticles()
  const fields = new Set<string>()

  articles.forEach((article) => {
    if (article.fieldOfScience) {
      fields.add(article.fieldOfScience)
    }
  })

  return Array.from(fields).sort()
}

export function getPopularSearches(limit = 10): { query: string; count: number }[] {
  const searches = JSON.parse(localStorage.getItem("journal_search_queries") || "[]")
  const queryCount = new Map<string, number>()

  searches.forEach((search: any) => {
    const query = search.query.toLowerCase()
    queryCount.set(query, (queryCount.get(query) || 0) + 1)
  })

  return Array.from(queryCount.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
