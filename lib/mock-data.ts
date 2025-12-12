// Mock data generator for demo purposes
import { createUser, getUserByEmail } from "./storage"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export interface MockArticle {
  id: string
  title: string
  abstract: string
  authors: string[]
  email: string
  keywords: string[]
  field: string
  submittedAt: string
  status: "pending" | "under_review" | "revision_required" | "accepted" | "rejected" | "published"
  reviewerId?: string
  reviewerComments?: string
  reviewScore?: number
  fileName?: string
  fileSize?: string
  views: number
  downloads: number
  citations: number
  doi?: string
}

export interface MockUser {
  id: string
  name: string
  email: string
  role: "author" | "reviewer" | "editor" | "admin"
  avatar?: string
  bio: string
  affiliation: string
  orcid?: string
  articlesCount: number
  reviewsCount: number
  joinedAt: string
  isActive: boolean
  language: string
}

export interface MockReview {
  id: string
  articleId: string
  reviewerId: string
  assignedAt: string
  dueDate: string
  completedAt?: string
  status: "pending" | "in_progress" | "completed" | "overdue"
  score?: number
  comments?: string
  recommendation?: "accept" | "minor_revision" | "major_revision" | "reject"
}

const firstNames = {
  uz: ["Aziz", "Botir", "Dilshod", "Farrux", "Jasur", "Kamol", "Nodira", "Sevara", "Zarina", "Malika"],
  ru: ["Александр", "Дмитрий", "Елена", "Ирина", "Михаил", "Ольга", "Сергей", "Татьяна", "Владимир", "Наталья"],
  en: ["James", "John", "Robert", "Michael", "Sarah", "Emily", "David", "Emma", "Daniel", "Sophia"],
  ky: ["Алмаз", "Бакыт", "Гүлзат", "Жаныл", "Кубат", "Нурбек", "Салтанат", "Талант", "Эмир", "Айгүл"],
  kk: ["Айдар", "Асель", "Дәурен", "Жанар", "Ерлан", "Камила", "Нұрлан", "Сәуле", "Тимур", "Қуаныш"],
  tg: ["Алишер", "Бахтиёр", "Гулнора", "Дилором", "Ҷавлон", "Мадина", "Нодир", "Сарвиноз", "Фаррух", "Шахноза"],
}

const lastNames = {
  uz: ["Abdullayev", "Karimov", "Rustamov", "Sultonov", "Toshmatov", "Umarova", "Yuldashev", "Zokirov"],
  ru: ["Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов", "Попов", "Соколов", "Лебедев"],
  en: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"],
  ky: ["Абдыраманов", "Исаков", "Касымов", "Мамытов", "Орозов", "Сыдыков", "Токтомушев", "Усубалиев"],
  kk: ["Абдрахманов", "Жұмабаев", "Қасымов", "Нұрланов", "Оразов", "Сейтов", "Тұрсынов", "Үсенов"],
  tg: ["Раҳимов", "Исмоилов", "Каримов", "Маҳмудов", "Назаров", "Салимов", "Усмонов", "Ҳасанов"],
}

const articleTitles = [
  "Machine Learning Approaches to Climate Change Prediction",
  "Novel Synthesis Methods for Organic Compounds",
  "Quantum Computing Applications in Cryptography",
  "Sustainable Agriculture Practices in Central Asia",
  "Neuroplasticity and Learning in Adult Brain",
  "Blockchain Technology for Supply Chain Management",
  "Advanced Materials for Solar Energy Conversion",
  "Artificial Intelligence in Medical Diagnostics",
  "Water Resource Management in Arid Regions",
  "Gene Editing Technologies and Ethical Considerations",
  "Smart Cities and IoT Infrastructure",
  "COVID-19 Pandemic Economic Impact Analysis",
  "Renewable Energy Integration in Power Grids",
  "Natural Language Processing for Low-Resource Languages",
  "Nanotechnology Applications in Drug Delivery",
  "Digital Transformation in Education Systems",
  "Cybersecurity Challenges in Modern Networks",
  "Biodiversity Conservation Strategies",
  "5G Networks and Future Communication Systems",
  "Cognitive Behavioral Therapy Effectiveness Studies",
]

const scientificFields = [
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Engineering",
  "Mathematics",
  "Economics",
  "Psychology",
  "Environmental Science",
  "Agriculture",
  "Materials Science",
  "Neuroscience",
  "Data Science",
  "Biotechnology",
]

const affiliations = [
  "National University of Uzbekistan",
  "Tashkent State Technical University",
  "Samarkand State University",
  "Bukhara State University",
  "Urgench State University",
  "Moscow State University",
  "MIT",
  "Stanford University",
  "Cambridge University",
  "ETH Zurich",
  "National University of Kyrgyzstan",
  "Al-Farabi Kazakh National University",
  "Tajik National University",
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

export function generateMockUsers(count = 50): MockUser[] {
  const users: MockUser[] = []
  const languages = ["uz", "ru", "en", "ky", "kk", "tg"] as const

  for (let i = 0; i < count; i++) {
    const language = getRandomItem(languages)
    const firstName = getRandomItem(firstNames[language])
    const lastName = getRandomItem(lastNames[language])
    const role = getRandomItem(["author", "author", "author", "reviewer", "reviewer", "editor", "admin"] as const)

    users.push({
      id: generateId(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      bio:
        role === "reviewer"
          ? `Experienced researcher specializing in ${getRandomItem(scientificFields)}`
          : `PhD candidate researching ${getRandomItem(scientificFields)}`,
      affiliation: getRandomItem(affiliations),
      orcid: `0000-000${i}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      articlesCount: Math.floor(Math.random() * 15),
      reviewsCount: role === "reviewer" ? Math.floor(5 + Math.random() * 25) : 0,
      joinedAt: getRandomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
      isActive: Math.random() > 0.1,
      language,
    })
  }

  return users
}

export function generateMockArticles(count = 100, users: MockUser[]): MockArticle[] {
  const articles: MockArticle[] = []
  const statuses: MockArticle["status"][] = [
    "pending",
    "under_review",
    "revision_required",
    "accepted",
    "rejected",
    "published",
  ]

  for (let i = 0; i < count; i++) {
    const authorUser = getRandomItem(users.filter((u) => u.role === "author" || u.role === "editor"))
    const coAuthorsCount = Math.floor(Math.random() * 4)
    const coAuthors = Array.from(
      { length: coAuthorsCount },
      () => getRandomItem(users.filter((u) => u.role === "author")).name,
    )
    const authors = [authorUser.name, ...coAuthors]

    const field = getRandomItem(scientificFields)
    const status = getRandomItem(statuses)
    const submittedDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28))

    const article: MockArticle = {
      id: generateId(),
      title: getRandomItem(articleTitles) + (i > articleTitles.length ? ` - Case Study ${i}` : ""),
      abstract: `This research presents a comprehensive analysis of ${field.toLowerCase()} with novel approaches and methodologies. Our findings demonstrate significant improvements over existing methods and provide new insights into the field.`,
      authors,
      email: authorUser.email,
      keywords: [field, getRandomItem(scientificFields), "Research", "Analysis", "Innovation"],
      field,
      submittedAt: submittedDate.toISOString(),
      status,
      fileName: `article_${i + 1}.pdf`,
      fileSize: `${Math.floor(500 + Math.random() * 2000)} KB`,
      views: Math.floor(50 + Math.random() * 1000),
      downloads: Math.floor(10 + Math.random() * 200),
      citations: status === "published" ? Math.floor(Math.random() * 50) : 0,
    }

    if (status !== "pending") {
      const reviewer = getRandomItem(users.filter((u) => u.role === "reviewer"))
      article.reviewerId = reviewer.id
    }

    if (status === "revision_required" || status === "rejected") {
      article.reviewerComments =
        "The manuscript requires significant improvements in methodology section. Please address the following concerns..."
      article.reviewScore = Math.floor(3 + Math.random() * 3)
    }

    if (status === "accepted" || status === "published") {
      article.reviewScore = Math.floor(7 + Math.random() * 3)
      article.doi = `10.1234/journal.2024.${1000 + i}`
    }

    articles.push(article)
  }

  return articles
}

export function generateMockReviews(articles: MockArticle[], users: MockUser[]): MockReview[] {
  const reviews: MockReview[] = []

  articles.forEach((article) => {
    if (article.status !== "pending" && article.reviewerId) {
      const assignedDate = new Date(article.submittedAt)
      assignedDate.setDate(assignedDate.getDate() + 2)

      const dueDate = new Date(assignedDate)
      dueDate.setDate(dueDate.getDate() + 14)

      const isCompleted = article.status !== "under_review"
      const isOverdue = !isCompleted && new Date() > dueDate

      const review: MockReview = {
        id: generateId(),
        articleId: article.id,
        reviewerId: article.reviewerId,
        assignedAt: assignedDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: isCompleted ? "completed" : isOverdue ? "overdue" : "in_progress",
      }

      if (isCompleted) {
        const completedDate = new Date(assignedDate)
        completedDate.setDate(completedDate.getDate() + Math.floor(5 + Math.random() * 10))
        review.completedAt = completedDate.toISOString()
        review.score = article.reviewScore
        review.comments = article.reviewerComments
        review.recommendation =
          article.status === "accepted" || article.status === "published"
            ? "accept"
            : article.status === "revision_required"
              ? getRandomItem(["minor_revision", "major_revision"])
              : "reject"
      }

      reviews.push(review)
    }
  })

  return reviews
}

export function initializeDemoAdminUsers() {
  if (typeof window === "undefined") return

  console.log("[v0] ==========================================")
  console.log("[v0] Initializing demo admin users...")
  console.log("[v0] ==========================================")

  const hashPassword = (password: string) => btoa(password)

  const adminExists = getUserByEmail("admin@journal.com")
  console.log("[v0] Checking for admin user:", adminExists ? "Found" : "Not found")

  const editorExists = getUserByEmail("editor@journal.com")
  if (!editorExists) {
    console.log("[v0] Creating editor user...")
    const editor = createUser({
      email: "editor@journal.com",
      password: hashPassword("editor123"),
      name: "Chief Editor",
      role: "admin",
      affiliation: "Editorial Board",
    })
    console.log("[v0] ✓ Created editor user:", editor.email, "ID:", editor.id)
  } else {
    console.log("[v0] ✓ Editor user already exists:", editorExists.email)
  }

  const authorExists = getUserByEmail("author@journal.com")
  if (!authorExists) {
    console.log("[v0] Creating author user...")
    const author = createUser({
      email: "author@journal.com",
      password: hashPassword("author123"),
      name: "Research Author",
      role: "author",
      affiliation: "National University",
    })
    console.log("[v0] ✓ Created author user:", author.email, "ID:", author.id)
  } else {
    console.log("[v0] ✓ Author user already exists:", authorExists.email)
  }

  const allUsers = [
    getUserByEmail("admin@journal.com"),
    getUserByEmail("editor@journal.com"),
    getUserByEmail("author@journal.com"),
  ]
  console.log("[v0] ==========================================")
  console.log("[v0] Demo users verification:")
  allUsers.forEach((user, index) => {
    const emails = ["admin@journal.com", "editor@journal.com", "author@journal.com"]
    console.log(`[v0] ${emails[index]}: ${user ? "✓ EXISTS" : "✗ MISSING"}`)
  })
  console.log("[v0] ==========================================")
}

export function initializeMockData() {
  if (typeof window === "undefined") {
    console.log("[v0] Skipping mock data init: not in browser")
    return
  }

  console.log("[v0] ==========================================")
  console.log("[v0] Starting mock data initialization...")
  console.log("[v0] ==========================================")

  initializeDemoAdminUsers()

  // Check if mock data already exists
  const existingData = localStorage.getItem("mockDataInitialized")
  if (existingData === "true") {
    console.log("[v0] Mock data already initialized (users, articles, reviews)")
    console.log("[v0] ==========================================")
    return
  }

  console.log("[v0] Initializing mock users, articles, and reviews...")

  // Generate users
  const users = generateMockUsers(50)
  localStorage.setItem("mockUsers", JSON.stringify(users))

  // Generate articles
  const articles = generateMockArticles(100, users)
  localStorage.setItem("mockArticles", JSON.stringify(articles))

  // Generate reviews
  const reviews = generateMockReviews(articles, users)
  localStorage.setItem("mockReviews", JSON.stringify(reviews))

  // Mark as initialized
  localStorage.setItem("mockDataInitialized", "true")

  console.log("[v0] Mock data initialized:", {
    users: users.length,
    articles: articles.length,
    reviews: reviews.length,
  })
}

export function getMockUsers(): MockUser[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("mockUsers")
  return data ? JSON.parse(data) : []
}

export function getMockArticles(): MockArticle[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("mockArticles")
  return data ? JSON.parse(data) : []
}

export function getMockReviews(): MockReview[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("mockReviews")
  return data ? JSON.parse(data) : []
}

export function resetMockData() {
  if (typeof window === "undefined") return
  localStorage.removeItem("mockDataInitialized")
  localStorage.removeItem("mockUsers")
  localStorage.removeItem("mockArticles")
  localStorage.removeItem("mockReviews")
  initializeMockData()
}
