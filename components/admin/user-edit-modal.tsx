"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/lib/language-context"
import type { MockUser } from "@/lib/mock-data"
import { useState, useEffect } from "react"

interface UserEditModalProps {
  user: MockUser | null
  open: boolean
  onClose: () => void
  onSave: (user: MockUser) => void
}

const translations = {
  uz: {
    addUser: "Foydalanuvchi qo'shish",
    editUser: "Foydalanuvchini tahrirlash",
    name: "Ism",
    email: "Email",
    role: "Rol",
    affiliation: "Tashkilot",
    bio: "Bio",
    orcid: "ORCID",
    isActive: "Faol",
    cancel: "Bekor qilish",
    save: "Saqlash",
    author: "Muallif",
    reviewer: "Taqrizchi",
    editor: "Muharrir",
    admin: "Administrator",
  },
  ru: {
    addUser: "Добавить пользователя",
    editUser: "Редактировать пользователя",
    name: "Имя",
    email: "Email",
    role: "Роль",
    affiliation: "Организация",
    bio: "Биография",
    orcid: "ORCID",
    isActive: "Активный",
    cancel: "Отмена",
    save: "Сохранить",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Администратор",
  },
  en: {
    addUser: "Add User",
    editUser: "Edit User",
    name: "Name",
    email: "Email",
    role: "Role",
    affiliation: "Affiliation",
    bio: "Bio",
    orcid: "ORCID",
    isActive: "Active",
    cancel: "Cancel",
    save: "Save",
    author: "Author",
    reviewer: "Reviewer",
    editor: "Editor",
    admin: "Admin",
  },
  ky: {
    addUser: "Колдонуучу кошуу",
    editUser: "Колдонуучуну өзгөртүү",
    name: "Аты",
    email: "Email",
    role: "Ролу",
    affiliation: "Уюм",
    bio: "Биография",
    orcid: "ORCID",
    isActive: "Активдүү",
    cancel: "Жокко чыгаруу",
    save: "Сактоо",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Администратор",
  },
  kk: {
    addUser: "Пайдаланушы қосу",
    editUser: "Пайдаланушыны өңдеу",
    name: "Аты",
    email: "Email",
    role: "Рөлі",
    affiliation: "Ұйым",
    bio: "Биография",
    orcid: "ORCID",
    isActive: "Белсенді",
    cancel: "Болдырмау",
    save: "Сақтау",
    author: "Автор",
    reviewer: "Рецензент",
    editor: "Редактор",
    admin: "Әкімші",
  },
  tg: {
    addUser: "Илова кардани корбар",
    editUser: "Таҳрири корбар",
    name: "Ном",
    email: "Email",
    role: "Нақш",
    affiliation: "Ташкилот",
    bio: "Биография",
    orcid: "ORCID",
    isActive: "Фаъол",
    cancel: "Бекор кардан",
    save: "Захира кардан",
    author: "Муаллиф",
    reviewer: "Рецензент",
    editor: "Муҳаррир",
    admin: "Администратор",
  },
}

export function UserEditModal({ user, open, onClose, onSave }: UserEditModalProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const [formData, setFormData] = useState<Partial<MockUser>>({
    name: "",
    email: "",
    role: "author",
    affiliation: "",
    bio: "",
    orcid: "",
    isActive: true,
    articlesCount: 0,
    reviewsCount: 0,
    language: "en",
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        name: "",
        email: "",
        role: "author",
        affiliation: "",
        bio: "",
        orcid: "",
        isActive: true,
        articlesCount: 0,
        reviewsCount: 0,
        language: "en",
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser: MockUser = {
      id: user?.id || crypto.randomUUID(),
      name: formData.name!,
      email: formData.email!,
      role: formData.role!,
      affiliation: formData.affiliation!,
      bio: formData.bio!,
      orcid: formData.orcid,
      isActive: formData.isActive!,
      articlesCount: formData.articlesCount!,
      reviewsCount: formData.reviewsCount!,
      joinedAt: user?.joinedAt || new Date().toISOString(),
      language: formData.language!,
      avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    }

    onSave(newUser)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? t.editUser : t.addUser}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t.role}</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author">{t.author}</SelectItem>
                  <SelectItem value="reviewer">{t.reviewer}</SelectItem>
                  <SelectItem value="editor">{t.editor}</SelectItem>
                  <SelectItem value="admin">{t.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcid">{t.orcid}</Label>
              <Input
                id="orcid"
                value={formData.orcid}
                onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                placeholder="0000-0000-0000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation">{t.affiliation}</Label>
            <Input
              id="affiliation"
              value={formData.affiliation}
              onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t.bio}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">{t.isActive}</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.save}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
