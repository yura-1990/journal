"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Edit, Trash2, UsersIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getMockUsers, type MockUser } from "@/lib/mock-data"
import { UserEditModal } from "@/components/admin/user-edit-modal"
import { useToast } from "@/hooks/use-toast"

const translations = {
  uz: {
    title: "Foydalanuvchilarni boshqarish",
    description: "Foydalanuvchilarni ko'rish va boshqarish",
    search: "Qidirish...",
    filterRole: "Rol bo'yicha filtrlash",
    filterStatus: "Status bo'yicha filtrlash",
    allRoles: "Barcha rollar",
    allStatuses: "Barcha statuslar",
    active: "Faol",
    inactive: "Faol emas",
    addUser: "Foydalanuvchi qo'shish",
    name: "Ism",
    email: "Email",
    role: "Rol",
    affiliation: "Tashkilot",
    articles: "Maqolalar",
    reviews: "Taqrizlar",
    status: "Status",
    actions: "Harakatlar",
    edit: "Tahrirlash",
    delete: "O'chirish",
    noResults: "Natijalar topilmadi",
    author: "Muallif",
    reviewer: "Taqrizchi",
    editor: "Muharrir",
    admin: "Administrator",
    totalUsers: "Jami foydalanuvchilar",
    activeUsers: "Faol foydalanuvchilar",
    authors: "Mualliflar",
    reviewers: "Taqrizchilar",
  },
  ru: {
    title: "Управление пользователями",
    description: "Просмотр и управление пользователями",
    search: "Поиск...",
    filterRole: "Фильтр по роли",
    filterStatus: "Фильтр по статусу",
    allRoles: "Все роли",
    allStatuses: "Все статусы",
    active: "Активный",
    inactive: "Неактивный",
    addUser: "Добавить пользователя",
    name: "Имя",
    email: "Email",
    role: "Роль",
    affiliation: "Организация",
    articles: "Статьи",
    reviews: "Рецензии",
    status: "Статус",
    actions: "Действия",
    edit: "Редактировать",
    delete: "Удалить",
    noResults: "Результаты не найдены",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Администратор",
    totalUsers: "Всего пользователей",
    activeUsers: "Активных пользователей",
    authors: "Авторы",
    reviewers: "Рецензенты",
  },
  en: {
    title: "User Management",
    description: "View and manage users",
    search: "Search...",
    filterRole: "Filter by role",
    filterStatus: "Filter by status",
    allRoles: "All roles",
    allStatuses: "All statuses",
    active: "Active",
    inactive: "Inactive",
    addUser: "Add User",
    name: "Name",
    email: "Email",
    role: "Role",
    affiliation: "Affiliation",
    articles: "Articles",
    reviews: "Reviews",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noResults: "No results found",
    author: "Author",
    reviewer: "Reviewer",
    editor: "Editor",
    admin: "Admin",
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    authors: "Authors",
    reviewers: "Reviewers",
  },
  ky: {
    title: "Колдонуучуларды башкаруу",
    description: "Колдонуучуларды көрүү жана башкаруу",
    search: "Издөө...",
    filterRole: "Ролго жараша чыпкалоо",
    filterStatus: "Статуска жараша чыпкалоо",
    allRoles: "Бардык роллер",
    allStatuses: "Бардык статустар",
    active: "Активдүү",
    inactive: "Активдүү эмес",
    addUser: "Колдонуучу кошуу",
    name: "Аты",
    email: "Email",
    role: "Ролу",
    affiliation: "Уюм",
    articles: "Макалалар",
    reviews: "Рецензиялар",
    status: "Статус",
    actions: "Аракеттер",
    edit: "Өзгөртүү",
    delete: "Өчүрүү",
    noResults: "Натыйжалар табылган жок",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Администратор",
    totalUsers: "Жалпы колдонуучулар",
    activeUsers: "Активдүү колдонуучулар",
    authors: "Авторлор",
    reviewers: "Рецензенттер",
  },
  kk: {
    title: "Пайдаланушыларды басқару",
    description: "Пайдаланушыларды қарау және басқару",
    search: "Іздеу...",
    filterRole: "Рөлі бойынша сүзу",
    filterStatus: "Күй бойынша сүзу",
    allRoles: "Барлық рөлдер",
    allStatuses: "Барлық күйлер",
    active: "Белсенді",
    inactive: "Белсенді емес",
    addUser: "Пайдаланушы қосу",
    name: "Аты",
    email: "Email",
    role: "Рөлі",
    affiliation: "Ұйым",
    articles: "Мақалалар",
    reviews: "Рецензиялар",
    status: "Күй",
    actions: "Әрекеттер",
    edit: "Өңдеу",
    delete: "Жою",
    noResults: "Нәтижелер табылмады",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Әкімші",
    totalUsers: "Барлық пайдаланушылар",
    activeUsers: "Белсенді пайдаланушылар",
    authors: "Авторлар",
    reviewers: "Рецензенттер",
  },
  tg: {
    title: "Идораи корбарон",
    description: "Дидан ва идораи корбарон",
    search: "Ҷустуҷӯ...",
    filterRole: "Филтр аз рӯи нақш",
    filterStatus: "Филтр аз рӯи ҳолат",
    allRoles: "Ҳамаи нақшҳо",
    allStatuses: "Ҳамаи ҳолатҳо",
    active: "Фаъол",
    inactive: "Ғайрифаъол",
    addUser: "Илова кардани корбар",
    name: "Ном",
    email: "Email",
    role: "Нақш",
    affiliation: "Ташкилот",
    articles: "Мақолаҳо",
    reviews: "Рецензияҳо",
    status: "Ҳолат",
    actions: "Амалҳо",
    edit: "Таҳрир",
    delete: "Нест кардан",
    noResults: "Натиҷаҳо ёфт нашуданд",
    author: "Муаллиф",
    reviewer: "Рецензент",
    editor: "Муҳаррир",
    admin: "Администратор",
    totalUsers: "Ҳамаи корбарон",
    activeUsers: "Корбарони фаъол",
    authors: "Муаллифон",
    reviewers: "Рецензентҳо",
  },
}

export default function UsersPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const { toast } = useToast()

  const [users, setUsers] = useState<MockUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)

  useEffect(() => {
    const mockUsers = getMockUsers()
    setUsers(mockUsers)
  }, [])

  const filteredUsers = useMemo(() => {
    let result = [...users]

    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.affiliation.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      result = result.filter((user) => user.isActive === isActive)
    }

    return result
  }, [users, searchQuery, roleFilter, statusFilter])

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      authors: users.filter((u) => u.role === "author").length,
      reviewers: users.filter((u) => u.role === "reviewer").length,
    }
  }, [users])

  const handleDeleteUser = (id: string) => {
    if (!confirm("Delete this user?")) return

    const updated = users.filter((u) => u.id !== id)
    setUsers(updated)
    localStorage.setItem("mockUsers", JSON.stringify(updated))
    toast({
      title: "Success",
      description: "User deleted",
    })
  }

  const handleSaveUser = (user: MockUser) => {
    let updated: MockUser[]

    if (selectedUser) {
      updated = users.map((u) => (u.id === user.id ? user : u))
    } else {
      updated = [...users, user]
    }

    setUsers(updated)
    localStorage.setItem("mockUsers", JSON.stringify(updated))
    setSelectedUser(null)
    setIsAddingUser(false)
    toast({
      title: "Success",
      description: selectedUser ? "User updated" : "User created",
    })
  }

  const getRoleBadge = (role: MockUser["role"]) => {
    const variants: Record<MockUser["role"], "default" | "secondary" | "outline"> = {
      author: "secondary",
      reviewer: "outline",
      editor: "default",
      admin: "default",
    }
    return <Badge variant={variants[role]}>{t[role]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">{t.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-sm text-muted-foreground">{t.activeUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.authors}</div>
            <p className="text-sm text-muted-foreground">{t.authors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.reviewers}</div>
            <p className="text-sm text-muted-foreground">{t.reviewers}</p>
          </CardContent>
        </Card>
      </div>

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

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allRoles}</SelectItem>
                <SelectItem value="author">{t.author}</SelectItem>
                <SelectItem value="reviewer">{t.reviewer}</SelectItem>
                <SelectItem value="editor">{t.editor}</SelectItem>
                <SelectItem value="admin">{t.admin}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="active">{t.active}</SelectItem>
                <SelectItem value="inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setIsAddingUser(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t.addUser}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.role}</TableHead>
                <TableHead>{t.affiliation}</TableHead>
                <TableHead className="text-center">{t.articles}</TableHead>
                <TableHead className="text-center">{t.reviews}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UsersIcon className="h-8 w-8" />
                      <p>{t.noResults}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{user.affiliation}</TableCell>
                    <TableCell className="text-center">{user.articlesCount}</TableCell>
                    <TableCell className="text-center">{user.reviewsCount}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {(selectedUser || isAddingUser) && (
        <UserEditModal
          user={selectedUser}
          open={!!(selectedUser || isAddingUser)}
          onClose={() => {
            setSelectedUser(null)
            setIsAddingUser(false)
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}
