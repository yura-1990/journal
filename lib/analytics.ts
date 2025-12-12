// Analytics utilities for tracking and reporting
import { getArticles, getArticleViews, getSearchQueries, getSubscriptions } from "./storage"

export interface ArticleStats {
  id: string
  title: string
  views: number
  downloads: number
  citationCount: number
}

export interface TimeSeriesData {
  date: string
  value: number
}

export interface FieldDistribution {
  field: string
  count: number
  percentage: number
}

export function getTopArticles(limit = 10): ArticleStats[] {
  const articles = getArticles().filter((a) => a.status === "published" || a.status === "approved")

  return articles
    .map((article) => ({
      id: article.id,
      title: article.titleEn,
      views: article.views || 0,
      downloads: article.downloads || 0,
      citationCount: 0, // Could be calculated from external data
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

export function getTotalStats() {
  const articles = getArticles()
  const views = getArticleViews()
  const subscriptions = getSubscriptions()

  const published = articles.filter((a) => a.status === "published" || a.status === "approved").length
  const pending = articles.filter((a) => a.status === "pending").length
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0)
  const totalDownloads = articles.reduce((sum, a) => sum + (a.downloads || 0), 0)
  const activeSubscriptions = subscriptions.filter((s) => s.active).length

  return {
    totalArticles: published,
    pendingArticles: pending,
    totalViews,
    totalDownloads,
    subscribers: activeSubscriptions,
  }
}

export function getViewsOverTime(days = 30): TimeSeriesData[] {
  const views = getArticleViews()
  const now = new Date()
  const dataMap = new Map<string, number>()

  // Initialize last N days
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    dataMap.set(dateStr, 0)
  }

  // Count views per day
  views.forEach((view) => {
    const dateStr = view.viewedAt.split("T")[0]
    if (dataMap.has(dateStr)) {
      dataMap.set(dateStr, (dataMap.get(dateStr) || 0) + 1)
    }
  })

  return Array.from(dataMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getFieldDistribution(): FieldDistribution[] {
  const articles = getArticles().filter((a) => a.status === "published" || a.status === "approved")
  const fieldCounts = new Map<string, number>()

  articles.forEach((article) => {
    const field = article.fieldOfScience
    fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1)
  })

  const total = articles.length

  return Array.from(fieldCounts.entries())
    .map(([field, count]) => ({
      field,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getPopularSearchTerms(limit = 10) {
  const searches = getSearchQueries()
  const termCounts = new Map<string, number>()

  searches.forEach((search) => {
    const term = search.query.toLowerCase()
    termCounts.set(term, (termCounts.get(term) || 0) + 1)
  })

  return Array.from(termCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getSubmissionTrends(months = 12): TimeSeriesData[] {
  const articles = getArticles()
  const now = new Date()
  const dataMap = new Map<string, number>()

  // Initialize last N months
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    dataMap.set(monthStr, 0)
  }

  // Count submissions per month
  articles.forEach((article) => {
    const date = new Date(article.submittedAt)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (dataMap.has(monthStr)) {
      dataMap.set(monthStr, (dataMap.get(monthStr) || 0) + 1)
    }
  })

  return Array.from(dataMap.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
