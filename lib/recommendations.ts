// Article recommendation engine
import { getArticles, getArticleViews, getUserBookmarks, type Article } from "./storage"

export function getRecommendedArticles(userId?: string, limit = 5): Article[] {
  const allArticles = getArticles().filter((a) => a.status === "published" || a.status === "approved")

  if (!userId) {
    // For non-logged users, return most popular articles
    return allArticles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
  }

  // Get user's viewing history and bookmarks
  const views = getArticleViews().filter((v) => v.userId === userId)
  const bookmarks = getUserBookmarks(userId)

  const viewedArticleIds = new Set(views.map((v) => v.articleId))
  const bookmarkedArticleIds = new Set(bookmarks.map((b) => b.articleId))

  // Get fields from viewed and bookmarked articles
  const userInterests = new Set<string>()
  allArticles.forEach((article) => {
    if (viewedArticleIds.has(article.id) || bookmarkedArticleIds.has(article.id)) {
      userInterests.add(article.fieldOfScience)
    }
  })

  // Score articles based on relevance
  const scoredArticles = allArticles
    .filter((article) => !viewedArticleIds.has(article.id)) // Exclude already viewed
    .map((article) => {
      let score = article.views || 0

      // Boost articles in user's interest fields
      if (userInterests.has(article.fieldOfScience)) {
        score += 100
      }

      // Boost recent articles
      const daysOld = (Date.now() - new Date(article.submittedAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysOld < 30) {
        score += 50
      }

      return { article, score }
    })
    .sort((a, b) => b.score - a.score)

  return scoredArticles.slice(0, limit).map((s) => s.article)
}

export function getReadingHistory(userId: string, limit = 10): Article[] {
  const views = getArticleViews().filter((v) => v.userId === userId)

  // Get unique article IDs in reverse chronological order
  const articleIds = [...new Set(views.sort((a, b) => b.viewedAt.localeCompare(a.viewedAt)).map((v) => v.articleId))]

  const articles = getArticles()
  return articleIds
    .map((id) => articles.find((a) => a.id === id))
    .filter((a) => a !== undefined)
    .slice(0, limit) as Article[]
}
