// Local storage utilities for articles and journal data

export interface Article {
  id: string
  authorNameUz: string
  authorNameRu: string
  authorNameEn: string
  email: string
  phone: string
  phoneAdditional?: string
  workplaceUz: string
  workplaceRu: string
  workplaceEn: string
  positionUz: string
  positionRu: string
  positionEn: string
  titleUz: string
  titleRu: string
  titleEn: string
  fieldOfScience: string
  keywordsUz: string
  keywordsRu: string
  keywordsEn: string
  fileName: string
  fileData: string // base64 encoded file
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export interface JournalIssue {
  id: string
  volume: string
  issue: string
  month: { uz: string; ru: string; en: string }
  year: string
  articles: number
  coverImage: string // base64 encoded image
  createdAt: string
}

const ARTICLES_KEY = "journal_articles"
const ISSUES_KEY = "journal_issues"

// Article functions
export function saveArticle(article: Article): void {
  const articles = getArticles()
  articles.push(article)
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
}

export function getArticles(): Article[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(ARTICLES_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error("[v0] Error loading articles:", error)
    return []
  }
}

export function updateArticleStatus(id: string, status: Article["status"]): void {
  const articles = getArticles()
  const index = articles.findIndex((a) => a.id === id)
  if (index !== -1) {
    articles[index].status = status
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
  }
}

export function deleteArticle(id: string): void {
  const articles = getArticles().filter((a) => a.id !== id)
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles))
}

// Journal issue functions
export function saveJournalIssue(issue: JournalIssue): void {
  const issues = getJournalIssues()
  issues.push(issue)
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
}

export function getJournalIssues(): JournalIssue[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(ISSUES_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch (error) {
    console.error("[v0] Error loading journal issues:", error)
    return []
  }
}

export function updateJournalIssue(id: string, updates: Partial<JournalIssue>): void {
  const issues = getJournalIssues()
  const index = issues.findIndex((i) => i.id === id)
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updates }
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
  }
}

export function deleteJournalIssue(id: string): void {
  const issues = getJournalIssues().filter((i) => i.id !== id)
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues))
}

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
