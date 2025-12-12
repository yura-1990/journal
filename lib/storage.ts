// Enhanced localStorage system with data migration and full feature support

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface User {
  id: string
  email: string
  password: string // hashed in real implementation
  name: string
  role: "admin" | "author" | "reviewer" | "reader"
  affiliation?: string
  orcid?: string
  createdAt: string
  lastLogin?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language: "uz" | "ru" | "en" | "ky" | "kk" | "tg"
  theme: "light" | "dark" | "system"
  emailNotifications: boolean
  newsletter: boolean
}

export interface Article {
  id: string
  authorNameUz: string
  authorNameRu: string
  authorNameEn: string
  authorNameKy?: string
  authorNameKk?: string
  authorNameTg?: string
  email: string
  phone: string
  phoneAdditional?: string
  workplaceUz: string
  workplaceRu: string
  workplaceEn: string
  workplaceKy?: string
  workplaceKk?: string
  workplaceTg?: string
  positionUz: string
  positionRu: string
  positionEn: string
  positionKy?: string
  positionKk?: string
  positionTg?: string
  titleUz: string
  titleRu: string
  titleEn: string
  titleKy?: string
  titleKk?: string
  titleTg?: string
  fieldOfScience: string
  keywordsUz: string
  keywordsRu: string
  keywordsEn: string
  keywordsKy?: string
  keywordsKk?: string
  keywordsTg?: string
  fileName: string
  fileData: string // base64 encoded file
  status: "pending" | "approved" | "rejected" | "revision" | "published"
  submittedAt: string
  reviewedAt?: string
  publishedAt?: string
  doi?: string
  views: number
  downloads: number
  userId?: string
  issueId?: string
}

export interface Bookmark {
  id: string
  userId: string
  articleId: string
  createdAt: string
  note?: string
}

export interface Subscription {
  id: string
  email: string
  name?: string
  type: "newsletter" | "new-issue" | "author-updates"
  language: "uz" | "ru" | "en" | "ky" | "kk" | "tg"
  active: boolean
  subscribedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "submission" | "review" | "publication" | "message" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface ArticleView {
  id: string
  articleId: string
  userId?: string
  viewedAt: string
  sessionId: string
}

export interface SearchQuery {
  id: string
  query: string
  filters?: {
    field?: string
    year?: string
    author?: string
  }
  results: number
  timestamp: string
}

export interface JournalIssue {
  id: string
  volume: string
  issue: string
  month: { uz: string; ru: string; en: string; ky: string; kk: string; tg: string }
  year: string
  articles: string[] // article IDs
  coverImage: string
  published: boolean
  publishedAt?: string
  createdAt: string
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_VERSION = "2.0"
const KEYS = {
  VERSION: "journal_storage_version",
  USERS: "journal_users",
  ARTICLES: "journal_articles",
  BOOKMARKS: "journal_bookmarks",
  SUBSCRIPTIONS: "journal_subscriptions",
  NOTIFICATIONS: "journal_notifications",
  VIEWS: "journal_article_views",
  SEARCHES: "journal_search_queries",
  ISSUES: "journal_issues",
  CURRENT_USER: "journal_current_user",
}

// ============================================
// DATA MIGRATION
// ============================================

function migrateData(): void {
  const currentVersion = localStorage.getItem(KEYS.VERSION)

  if (currentVersion === STORAGE_VERSION) return

  console.log("[v0] Migrating data to version", STORAGE_VERSION)

  // Migrate articles - add new fields
  const oldArticles = getArticles()
  oldArticles.forEach((article) => {
    article.views = article.views || 0
    article.downloads = article.downloads || 0
  })
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(oldArticles))

  // Initialize empty collections if they don't exist
  if (!localStorage.getItem(KEYS.BOOKMARKS)) {
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify([]))
  }
  if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify([]))
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]))
  }
  if (!localStorage.getItem(KEYS.VIEWS)) {
    localStorage.setItem(KEYS.VIEWS, JSON.stringify([]))
  }
  if (!localStorage.getItem(KEYS.SEARCHES)) {
    localStorage.setItem(KEYS.SEARCHES, JSON.stringify([]))
  }

  localStorage.setItem(KEYS.VERSION, STORAGE_VERSION)
  console.log("[v0] Migration complete")
}

// Run migration on module load
if (typeof window !== "undefined") {
  migrateData()
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`[v0] Error reading ${key}:`, error)
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`[v0] Error saving ${key}:`, error)
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

export function createUser(userData: Omit<User, "id" | "createdAt" | "preferences">): User {
  const user: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    preferences: {
      language: "uz",
      theme: "system",
      emailNotifications: true,
      newsletter: false,
    },
  }

  const users = getUsers()
  users.push(user)
  safeSetItem(KEYS.USERS, users)

  return user
}

export function getUsers(): User[] {
  return safeGetItem(KEYS.USERS, [])
}

export function getUserById(id: string): User | null {
  return getUsers().find((u) => u.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  return getUsers().find((u) => u.email === email) || null
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    safeSetItem(KEYS.USERS, users)
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    safeSetItem(KEYS.CURRENT_USER, user.id)
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER)
  }
}

export function getCurrentUser(): User | null {
  const userId = safeGetItem<string | null>(KEYS.CURRENT_USER, null)
  return userId ? getUserById(userId) : null
}

// ============================================
// ARTICLE MANAGEMENT
// ============================================

export function saveArticle(article: Article): void {
  const articles = getArticles()
  articles.push(article)
  safeSetItem(KEYS.ARTICLES, articles)
}

export function getArticles(): Article[] {
  return safeGetItem(KEYS.ARTICLES, [])
}

export function getArticleById(id: string): Article | null {
  return getArticles().find((a) => a.id === id) || null
}

export function updateArticle(id: string, updates: Partial<Article>): void {
  const articles = getArticles()
  const index = articles.findIndex((a) => a.id === id)
  if (index !== -1) {
    articles[index] = { ...articles[index], ...updates }
    safeSetItem(KEYS.ARTICLES, articles)
  }
}

export function updateArticleStatus(id: string, status: Article["status"]): void {
  updateArticle(id, {
    status,
    reviewedAt: new Date().toISOString(),
  })
}

export function deleteArticle(id: string): void {
  const articles = getArticles().filter((a) => a.id !== id)
  safeSetItem(KEYS.ARTICLES, articles)

  // Clean up related data
  const bookmarks = getBookmarks().filter((b) => b.articleId !== id)
  safeSetItem(KEYS.BOOKMARKS, bookmarks)

  const views = getArticleViews().filter((v) => v.articleId !== id)
  safeSetItem(KEYS.VIEWS, views)
}

export function incrementArticleViews(articleId: string, userId?: string): void {
  const article = getArticleById(articleId)
  if (!article) return

  updateArticle(articleId, { views: (article.views || 0) + 1 })

  // Track view
  const view: ArticleView = {
    id: `view-${Date.now()}`,
    articleId,
    userId,
    viewedAt: new Date().toISOString(),
    sessionId: getSessionId(),
  }

  const views = getArticleViews()
  views.push(view)
  safeSetItem(KEYS.VIEWS, views)
}

export function incrementArticleDownloads(articleId: string): void {
  const article = getArticleById(articleId)
  if (!article) return

  updateArticle(articleId, { downloads: (article.downloads || 0) + 1 })
}

// ============================================
// BOOKMARK MANAGEMENT
// ============================================

export function addBookmark(userId: string, articleId: string, note?: string): Bookmark {
  const bookmark: Bookmark = {
    id: `bookmark-${Date.now()}`,
    userId,
    articleId,
    createdAt: new Date().toISOString(),
    note,
  }

  const bookmarks = getBookmarks()
  bookmarks.push(bookmark)
  safeSetItem(KEYS.BOOKMARKS, bookmarks)

  return bookmark
}

export function removeBookmark(userId: string, articleId: string): void {
  const bookmarks = getBookmarks().filter((b) => !(b.userId === userId && b.articleId === articleId))
  safeSetItem(KEYS.BOOKMARKS, bookmarks)
}

export function getBookmarks(): Bookmark[] {
  return safeGetItem(KEYS.BOOKMARKS, [])
}

export function getUserBookmarks(userId: string): Bookmark[] {
  return getBookmarks().filter((b) => b.userId === userId)
}

export function isBookmarked(userId: string, articleId: string): boolean {
  return getBookmarks().some((b) => b.userId === userId && b.articleId === articleId)
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export function addSubscription(subscription: Omit<Subscription, "id" | "subscribedAt" | "active">): Subscription {
  const sub: Subscription = {
    ...subscription,
    id: `sub-${Date.now()}`,
    active: true,
    subscribedAt: new Date().toISOString(),
  }

  const subscriptions = getSubscriptions()
  subscriptions.push(sub)
  safeSetItem(KEYS.SUBSCRIPTIONS, subscriptions)

  return sub
}

export function getSubscriptions(): Subscription[] {
  return safeGetItem(KEYS.SUBSCRIPTIONS, [])
}

export function unsubscribe(email: string): void {
  const subscriptions = getSubscriptions().map((sub) => (sub.email === email ? { ...sub, active: false } : sub))
  safeSetItem(KEYS.SUBSCRIPTIONS, subscriptions)
}

// ============================================
// NOTIFICATION MANAGEMENT
// ============================================

export function createNotification(notification: Omit<Notification, "id" | "createdAt" | "read">): Notification {
  const notif: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  }

  const notifications = getNotifications()
  notifications.push(notif)
  safeSetItem(KEYS.NOTIFICATIONS, notifications)

  return notif
}

export function getNotifications(): Notification[] {
  return safeGetItem(KEYS.NOTIFICATIONS, [])
}

export function getUserNotifications(userId: string): Notification[] {
  return getNotifications().filter((n) => n.userId === userId)
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n))
  safeSetItem(KEYS.NOTIFICATIONS, notifications)
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = getNotifications().map((n) => (n.userId === userId ? { ...n, read: true } : n))
  safeSetItem(KEYS.NOTIFICATIONS, notifications)
}

// ============================================
// SEARCH & ANALYTICS
// ============================================

export function logSearch(query: string, filters: SearchQuery["filters"], results: number): void {
  const search: SearchQuery = {
    id: `search-${Date.now()}`,
    query,
    filters,
    results,
    timestamp: new Date().toISOString(),
  }

  const searches = getSearchQueries()
  searches.push(search)

  // Keep only last 1000 searches
  if (searches.length > 1000) {
    searches.splice(0, searches.length - 1000)
  }

  safeSetItem(KEYS.SEARCHES, searches)
}

export function getSearchQueries(): SearchQuery[] {
  return safeGetItem(KEYS.SEARCHES, [])
}

export function getArticleViews(): ArticleView[] {
  return safeGetItem(KEYS.VIEWS, [])
}

export function getArticleViewCount(articleId: string): number {
  return getArticleViews().filter((v) => v.articleId === articleId).length
}

// ============================================
// JOURNAL ISSUE MANAGEMENT
// ============================================

export function saveJournalIssue(issue: JournalIssue): void {
  const issues = getJournalIssues()
  issues.push(issue)
  safeSetItem(KEYS.ISSUES, issues)
}

export function getJournalIssues(): JournalIssue[] {
  return safeGetItem(KEYS.ISSUES, [])
}

export function getJournalIssueById(id: string): JournalIssue | null {
  return getJournalIssues().find((i) => i.id === id) || null
}

export function updateJournalIssue(id: string, updates: Partial<JournalIssue>): void {
  const issues = getJournalIssues()
  const index = issues.findIndex((i) => i.id === id)
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updates }
    safeSetItem(KEYS.ISSUES, issues)
  }
}

export function deleteJournalIssue(id: string): void {
  const issues = getJournalIssues().filter((i) => i.id !== id)
  safeSetItem(KEYS.ISSUES, issues)
}

// ============================================
// FILE UTILITIES (from original local-storage.ts)
// ============================================

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let result = ""

  for (let i = 0; i < bytes.length; i += 3) {
    const byte1 = bytes[i]
    const byte2 = i + 1 < bytes.length ? bytes[i + 1] : 0
    const byte3 = i + 2 < bytes.length ? bytes[i + 2] : 0

    const encoded1 = byte1 >> 2
    const encoded2 = ((byte1 & 3) << 4) | (byte2 >> 4)
    const encoded3 = ((byte2 & 15) << 2) | (byte3 >> 6)
    const encoded4 = byte3 & 63

    result += BASE64_CHARS[encoded1] + BASE64_CHARS[encoded2]

    if (i + 1 < bytes.length) {
      result += BASE64_CHARS[encoded3]
    } else {
      result += "="
    }

    if (i + 2 < bytes.length) {
      result += BASE64_CHARS[encoded4]
    } else {
      result += "="
    }
  }

  return result
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = base64.replace(/[^A-Za-z0-9+/=]/g, "")
  const len = binaryString.length
  const bytes = new Uint8Array(Math.floor((len * 3) / 4))

  let p = 0
  for (let i = 0; i < len; i += 4) {
    const encoded1 = BASE64_CHARS.indexOf(binaryString[i])
    const encoded2 = BASE64_CHARS.indexOf(binaryString[i + 1])
    const encoded3 = BASE64_CHARS.indexOf(binaryString[i + 2])
    const encoded4 = BASE64_CHARS.indexOf(binaryString[i + 3])

    if (encoded1 === -1 || encoded2 === -1) continue

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4)

    if (encoded3 !== -1 && binaryString[i + 2] !== "=") {
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
    }

    if (encoded4 !== -1 && binaryString[i + 3] !== "=") {
      bytes[p++] = ((encoded3 & 3) << 6) | encoded4
    }
  }

  return bytes.slice(0, p)
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer
        const base64 = arrayBufferToBase64(arrayBuffer)
        const mimeType = file.type || "application/octet-stream"
        const dataUrl = `data:${mimeType};base64,${base64}`
        resolve(dataUrl)
      } catch (error) {
        console.error("[v0] Error encoding file to base64:", error)
        reject(error)
      }
    }

    reader.onerror = (error) => {
      console.error("[v0] FileReader error:", error)
      reject(error)
    }

    try {
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error("[v0] Error calling readAsArrayBuffer:", error)
      reject(error)
    }
  })
}

export function base64ToBlob(base64: string): Blob {
  try {
    const parts = base64.split(";base64,")
    const contentType = parts[0].split(":")[1] || "application/octet-stream"
    const base64Data = parts[1]

    const bytes = base64ToUint8Array(base64Data)
    return new Blob([bytes], { type: contentType })
  } catch (error) {
    console.error("[v0] Error decoding base64, returning empty blob:", error)
    return new Blob([], { type: "application/octet-stream" })
  }
}

export async function downloadFile(base64: string, fileName: string): Promise<void> {
  try {
    const blob = base64ToBlob(base64)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("[v0] Error downloading file:", error)
    alert("Error downloading file. The file may be corrupted.")
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getSessionId(): string {
  let sessionId = sessionStorage.getItem("journal_session_id")
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("journal_session_id", sessionId)
  }
  return sessionId
}

export function clearAllData(): void {
  if (typeof window === "undefined") return

  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })

  console.log("[v0] All data cleared")
}

export function exportData(): string {
  const data = {
    version: STORAGE_VERSION,
    users: getUsers(),
    articles: getArticles(),
    bookmarks: getBookmarks(),
    subscriptions: getSubscriptions(),
    notifications: getNotifications(),
    views: getArticleViews(),
    searches: getSearchQueries(),
    issues: getJournalIssues(),
    exportedAt: new Date().toISOString(),
  }

  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData)

    if (data.users) safeSetItem(KEYS.USERS, data.users)
    if (data.articles) safeSetItem(KEYS.ARTICLES, data.articles)
    if (data.bookmarks) safeSetItem(KEYS.BOOKMARKS, data.bookmarks)
    if (data.subscriptions) safeSetItem(KEYS.SUBSCRIPTIONS, data.subscriptions)
    if (data.notifications) safeSetItem(KEYS.NOTIFICATIONS, data.notifications)
    if (data.views) safeSetItem(KEYS.VIEWS, data.views)
    if (data.searches) safeSetItem(KEYS.SEARCHES, data.searches)
    if (data.issues) safeSetItem(KEYS.ISSUES, data.issues)

    console.log("[v0] Data imported successfully")
  } catch (error) {
    console.error("[v0] Error importing data:", error)
    throw new Error("Invalid import data format")
  }
}
