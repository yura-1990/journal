"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { saveArticle, fileToBase64, type Article } from "@/lib/local-storage"
import { useAuth } from "@/components/auth-provider"
import { sendNotification } from "@/lib/notifications"
import { useRouter } from "next/navigation"

const FIELDS_OF_SCIENCE = ["Pedagogy", "Philology", "Economics", "Law", "History", "Other"]

export default function SubmitArticlePage() {
  const { language, t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!file) {
        throw new Error(
          language === "uz"
            ? "Iltimos, maqola faylini yuklang"
            : language === "ru"
              ? "Пожалуйста, загрузите файл статьи"
              : language === "ky"
                ? "Сураныч, макала файлын жүктөңүз"
                : language === "kk"
                  ? "Өтінеміз, мақала файлын жүктеңіз"
                  : language === "tg"
                    ? "Лутфан, файли мақоларо боргузорӣ кунед"
                    : "Please upload article file",
        )
      }

      const formData = new FormData(e.currentTarget)

      // Convert file to base64 for storage
      const fileBase64 = await fileToBase64(file)

      const article: Article = {
        id: `article-${Date.now()}`,
        authorNameUz: formData.get("author_name_uz") as string,
        authorNameRu: formData.get("author_name_ru") as string,
        authorNameEn: formData.get("author_name_en") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        phoneAdditional: (formData.get("phone_additional") as string) || undefined,
        workplaceUz: formData.get("workplace_uz") as string,
        workplaceRu: formData.get("workplace_ru") as string,
        workplaceEn: formData.get("workplace_en") as string,
        positionUz: formData.get("position_uz") as string,
        positionRu: formData.get("position_ru") as string,
        positionEn: formData.get("position_en") as string,
        titleUz: formData.get("article_title_uz") as string,
        titleRu: formData.get("article_title_ru") as string,
        titleEn: formData.get("article_title_en") as string,
        fieldOfScience: formData.get("field_of_science") as string,
        keywordsUz: formData.get("keywords_uz") as string,
        keywordsRu: formData.get("keywords_ru") as string,
        keywordsEn: formData.get("keywords_en") as string,
        fileName: file.name,
        fileData: fileBase64,
        status: "pending",
        submittedAt: new Date().toISOString(),
        userId: user?.id,
      }

      saveArticle(article)

      if (user) {
        sendNotification(user.id, {
          type: "submission",
          title:
            language === "uz"
              ? "Maqola yuborildi"
              : language === "ru"
                ? "Статья отправлена"
                : language === "ky"
                  ? "Макала жөнөтүлдү"
                  : language === "kk"
                    ? "Мақала жіберілді"
                    : language === "tg"
                      ? "Мақола фиристода шуд"
                      : "Article submitted",
          message:
            language === "uz"
              ? `Sizning "${article.titleUz}" maqolangiz muvaffaqiyatli yuborildi va ko'rib chiqish jarayonida.`
              : language === "ru"
                ? `Ваша статья "${article.titleRu}" успешно отправлена и находится на рассмотрении.`
                : language === "ky"
                  ? `Сиздин "${article.titleEn}" макалаңыз ийгиликтүү жөнөтүлдү жана карап чыгууда.`
                  : language === "kk"
                    ? `Сіздің "${article.titleEn}" мақалаңыз сәтті жіберілді және қаралуда.`
                    : language === "tg"
                      ? `Мақолаи шумо "${article.titleEn}" бомуваффақият фиристода шуд ва дар ҳоли баррасӣ аст.`
                      : `Your article "${article.titleEn}" has been successfully submitted and is under review.`,
          articleId: article.id,
        })
      }

      setSuccess(true)
      e.currentTarget.reset()
      setFile(null)

      setTimeout(() => {
        setSuccess(false)
        if (user) {
          router.push("/dashboard")
        }
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t.home, href: "/" },
          { label: t.submitArticle, href: "/submit-article" },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {language === "uz"
                ? "Maqola yuborish"
                : language === "ru"
                  ? "Подать статью"
                  : language === "ky"
                    ? "Макала тапсыруу"
                    : language === "kk"
                      ? "Мақала тапсыру"
                      : language === "tg"
                        ? "Пешниҳоди мақола"
                        : "Submit Article"}
            </CardTitle>
            <CardDescription>
              {language === "uz"
                ? "Jurnalga nashr etish uchun maqolangizni yuboring"
                : language === "ru"
                  ? "Отправьте свою статью для публикации в журнале"
                  : language === "ky"
                    ? "Журналда жарыялоо үчүн макалаңызды жөнөтүңүз"
                    : language === "kk"
                      ? "Журналда жариялау үшін мақалаңызды жіберіңіз"
                      : language === "tg"
                        ? "Мақолаи худро барои нашр дар маҷалла пешниҳод кунед"
                        : "Submit your article for publication in the journal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {language === "uz"
                      ? "Maqola muvaffaqiyatli yuborildi! Administrator ko'rib chiqadi."
                      : language === "ru"
                        ? "Статья успешно отправлена! Администратор рассмотрит её."
                        : language === "ky"
                          ? "Макала ийгиликтүү жөнөтүлдү! Администратор аны карап чыгат."
                          : language === "kk"
                            ? "Мақала сәтті жіберілді! Әкімші оны қарайды."
                            : language === "tg"
                              ? "Мақола бомуваффақият фиристода шуд! Маъмур онро баррасӣ мекунад."
                              : "Article submitted successfully! Administrator will review it."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Author Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === "uz"
                    ? "Muallif ma'lumotlari"
                    : language === "ru"
                      ? "Информация об авторе"
                      : language === "ky"
                        ? "Автор жөнүндө маалымат"
                        : language === "kk"
                          ? "Автор туралы ақпарат"
                          : language === "tg"
                            ? "Маълумот дар бораи муаллиф"
                            : "Author Information"}
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="author_name_uz">
                      {language === "uz"
                        ? "F.I.O (O'zbekcha)"
                        : language === "ru"
                          ? "Ф.И.О (Узбекский)"
                          : language === "ky"
                            ? "F.I.O (Кыргыз)"
                            : language === "kk"
                              ? "F.I.O (Қазақ)"
                              : language === "tg"
                                ? "F.I.O (Тоҷик)"
                                : "Full Name (Uzbek)"}
                    </Label>
                    <Input id="author_name_uz" name="author_name_uz" required />
                  </div>
                  <div>
                    <Label htmlFor="author_name_ru">
                      {language === "uz"
                        ? "F.I.O (Ruscha)"
                        : language === "ru"
                          ? "Ф.И.О (Русский)"
                          : language === "ky"
                            ? "F.I.O (Орус)"
                            : language === "kk"
                              ? "F.I.O (Орус)"
                              : language === "tg"
                                ? "F.I.O (Орус)"
                                : "Full Name (Russian)"}
                    </Label>
                    <Input id="author_name_ru" name="author_name_ru" required />
                  </div>
                  <div>
                    <Label htmlFor="author_name_en">
                      {language === "uz"
                        ? "F.I.O (Inglizcha)"
                        : language === "ru"
                          ? "Ф.И.О (Английский)"
                          : language === "ky"
                            ? "F.I.O (Англис)"
                            : language === "kk"
                              ? "F.I.O (Англис)"
                              : language === "tg"
                                ? "F.I.O (Англис)"
                                : "Full Name (English)"}
                    </Label>
                    <Input id="author_name_en" name="author_name_en" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {language === "uz"
                        ? "Telefon"
                        : language === "ru"
                          ? "Телефон"
                          : language === "ky"
                            ? "Телефон"
                            : language === "kk"
                              ? "Телефон"
                              : language === "tg"
                                ? "Телефон"
                                : "Phone"}
                    </Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone_additional">
                    {language === "uz"
                      ? "Qo'shimcha telefon (ixtiyoriy)"
                      : language === "ru"
                        ? "Дополнительный телефон (необязательно)"
                        : language === "ky"
                          ? "Көбүнчө телефон (мүмкүн)"
                          : language === "kk"
                            ? "Қосымша телефон (мүмкін)"
                            : language === "tg"
                              ? "Телефони бораи қашқиби (мумкин)"
                              : "Additional Phone (optional)"}
                  </Label>
                  <Input id="phone_additional" name="phone_additional" type="tel" />
                </div>
              </div>

              {/* Workplace Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === "uz"
                    ? "Ish joyi ma'lumotlari"
                    : language === "ru"
                      ? "Место работы"
                      : language === "ky"
                        ? "Иш жери жөнүндө маалымат"
                        : language === "kk"
                          ? "Иш жери туралы ақпарат"
                          : language === "tg"
                            ? "Маълумот дар бораи иш жери"
                            : "Workplace Information"}
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="workplace_uz">
                      {language === "uz"
                        ? "Ish joyi (O'zbekcha)"
                        : language === "ru"
                          ? "Место работы (Узбекский)"
                          : language === "ky"
                            ? "Иш жери (Кыргыз)"
                            : language === "kk"
                              ? "Иш жери (Қазақ)"
                              : language === "tg"
                                ? "Иш жери (Тоҷик)"
                                : "Workplace (Uzbek)"}
                    </Label>
                    <Input id="workplace_uz" name="workplace_uz" required />
                  </div>
                  <div>
                    <Label htmlFor="workplace_ru">
                      {language === "uz"
                        ? "Ish joyi (Ruscha)"
                        : language === "ru"
                          ? "Место работы (Русский)"
                          : language === "ky"
                            ? "Иш жери (Орус)"
                            : language === "kk"
                              ? "Иш жери (Орус)"
                              : language === "tg"
                                ? "Иш жери (Орус)"
                                : "Workplace (Russian)"}
                    </Label>
                    <Input id="workplace_ru" name="workplace_ru" required />
                  </div>
                  <div>
                    <Label htmlFor="workplace_en">
                      {language === "uz"
                        ? "Ish joyi (Inglizcha)"
                        : language === "ru"
                          ? "Место работы (Английский)"
                          : language === "ky"
                            ? "Иш жери (Англис)"
                            : language === "kk"
                              ? "Иш жери (Англис)"
                              : language === "tg"
                                ? "Иш жери (Англис)"
                                : "Workplace (English)"}
                    </Label>
                    <Input id="workplace_en" name="workplace_en" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="position_uz">
                      {language === "uz"
                        ? "Lavozim (O'zbekcha)"
                        : language === "ru"
                          ? "Должность (Узбекский)"
                          : language === "ky"
                            ? "Лавозим (Кыргыз)"
                            : language === "kk"
                              ? "Лавозым (Қазақ)"
                              : language === "tg"
                                ? "Лавозим (Тоҷик)"
                                : "Position (Uzbek)"}
                    </Label>
                    <Input id="position_uz" name="position_uz" required />
                  </div>
                  <div>
                    <Label htmlFor="position_ru">
                      {language === "uz"
                        ? "Lavozim (Ruscha)"
                        : language === "ru"
                          ? "Должность (Русский)"
                          : language === "ky"
                            ? "Лавозим (Орус)"
                            : language === "kk"
                              ? "Лавозым (Орус)"
                              : language === "tg"
                                ? "Лавозим (Орус)"
                                : "Position (Russian)"}
                    </Label>
                    <Input id="position_ru" name="position_ru" required />
                  </div>
                  <div>
                    <Label htmlFor="position_en">
                      {language === "uz"
                        ? "Lavozim (Inglizcha)"
                        : language === "ru"
                          ? "Должность (Английский)"
                          : language === "ky"
                            ? "Лавозим (Англис)"
                            : language === "kk"
                              ? "Лавозым (Англис)"
                              : language === "tg"
                                ? "Лавозим (Англис)"
                                : "Position (English)"}
                    </Label>
                    <Input id="position_en" name="position_en" required />
                  </div>
                </div>
              </div>

              {/* Article Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === "uz"
                    ? "Maqola ma'lumotlari"
                    : language === "ru"
                      ? "Информация о статье"
                      : language === "ky"
                        ? "Макала жөнүндө маалымат"
                        : language === "kk"
                          ? "Мақала туралы ақпарат"
                          : language === "tg"
                            ? "Маълумот дар бораи мақола"
                            : "Article Information"}
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="article_title_uz">
                      {language === "uz"
                        ? "Maqola sarlavhasi (O'zbekcha)"
                        : language === "ru"
                          ? "Название статьи (Узбекский)"
                          : language === "ky"
                            ? "Макала аталышы (Кыргыз)"
                            : language === "kk"
                              ? "Мақала атауы (Қазақ)"
                              : language === "tg"
                                ? "Номи мақола (Тоҷик)"
                                : "Article Title (Uzbek)"}
                    </Label>
                    <Input id="article_title_uz" name="article_title_uz" required />
                  </div>
                  <div>
                    <Label htmlFor="article_title_ru">
                      {language === "uz"
                        ? "Maqola sarlavhasi (Ruscha)"
                        : language === "ru"
                          ? "Название статьи (Русский)"
                          : language === "ky"
                            ? "Макала аталышы (Орус)"
                            : language === "kk"
                              ? "Мақала атауы (Орус)"
                              : language === "tg"
                                ? "Номи мақола (Орус)"
                                : "Article Title (Russian)"}
                    </Label>
                    <Input id="article_title_ru" name="article_title_ru" required />
                  </div>
                  <div>
                    <Label htmlFor="article_title_en">
                      {language === "uz"
                        ? "Maqola sarlavhasi (Inglizcha)"
                        : language === "ru"
                          ? "Название статьи (Английский)"
                          : language === "ky"
                            ? "Макала аталышы (Англис)"
                            : language === "kk"
                              ? "Мақала атауы (Англис)"
                              : language === "tg"
                                ? "Номи мақола (Англис)"
                                : "Article Title (English)"}
                    </Label>
                    <Input id="article_title_en" name="article_title_en" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="field_of_science">
                    {language === "uz"
                      ? "Fan sohasi"
                      : language === "ru"
                        ? "Область науки"
                        : language === "ky"
                          ? "Фан саласы"
                          : language === "kk"
                            ? "Ғылыми саласы"
                            : language === "tg"
                              ? "Саласи фан"
                              : "Field of Science"}
                  </Label>
                  <Select name="field_of_science" required>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          language === "uz"
                            ? "Tanlang"
                            : language === "ru"
                              ? "Выберите"
                              : language === "ky"
                                ? "Тандоо"
                                : language === "kk"
                                  ? "Таңдаңыз"
                                  : language === "tg"
                                    ? "Танланда"
                                    : "Select"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELDS_OF_SCIENCE.map((field) => (
                        <SelectItem key={field} value={field.toLowerCase()}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="keywords_uz">
                      {language === "uz"
                        ? "Kalit so'zlar (O'zbekcha)"
                        : language === "ru"
                          ? "Ключевые слова (Узбекский)"
                          : language === "ky"
                            ? "Калит сөздөрү (Кыргыз)"
                            : language === "kk"
                              ? "Калит сөздері (Қазақ)"
                              : language === "tg"
                                ? "Калит сөздар (Тоҷик)"
                                : "Keywords (Uzbek)"}
                    </Label>
                    <Textarea id="keywords_uz" name="keywords_uz" rows={2} required />
                  </div>
                  <div>
                    <Label htmlFor="keywords_ru">
                      {language === "uz"
                        ? "Kalit so'zlar (Ruscha)"
                        : language === "ru"
                          ? "Ключевые слова (Русский)"
                          : language === "ky"
                            ? "Калит сөздөрү (Орус)"
                            : language === "kk"
                              ? "Калит сөздері (Орус)"
                              : language === "tg"
                                ? "Калит сөздар (Орус)"
                                : "Keywords (Russian)"}
                    </Label>
                    <Textarea id="keywords_ru" name="keywords_ru" rows={2} required />
                  </div>
                  <div>
                    <Label htmlFor="keywords_en">
                      {language === "uz"
                        ? "Kalit so'zlar (Inglizcha)"
                        : language === "ru"
                          ? "Ключевые слова (Английский)"
                          : language === "ky"
                            ? "Калит сөздөрү (Англис)"
                            : language === "kk"
                              ? "Калит сөздері (Англис)"
                              : language === "tg"
                                ? "Калит сөздар (Англис)"
                                : "Keywords (English)"}
                    </Label>
                    <Textarea id="keywords_en" name="keywords_en" rows={2} required />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="article_file">
                  {language === "uz"
                    ? "Maqola fayli (MS Word)"
                    : language === "ru"
                      ? "Файл статьи (MS Word)"
                      : language === "ky"
                        ? "Макала файлы (MS Word)"
                        : language === "kk"
                          ? "Мақала файлы (MS Word)"
                          : language === "tg"
                            ? "Файли мақола (MS Word)"
                            : "Article File (MS Word)"}
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="article_file"
                    type="file"
                    accept=".doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="flex-1"
                  />
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    {language === "uz"
                      ? "Tanlangan"
                      : language === "ru"
                        ? "Выбран"
                        : language === "ky"
                          ? "Тандалган"
                          : language === "kk"
                            ? "Таңдалған"
                            : language === "tg"
                              ? "Тандалган"
                              : "Selected"}
                    : {file.name}
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading
                  ? language === "uz"
                    ? "Yuborilmoqda..."
                    : language === "ru"
                      ? "Отправка..."
                      : language === "ky"
                        ? "Жөнөтүлүүдө..."
                        : language === "kk"
                          ? "Жіберілуде..."
                          : language === "tg"
                            ? "Дар ҳоли фиристодан..."
                            : "Submitting..."
                  : language === "uz"
                    ? "Maqolani yuborish"
                    : language === "ru"
                      ? "Отправить статью"
                      : language === "ky"
                        ? "Макаланы жөнөтүү"
                        : language === "kk"
                          ? "Мақаланы жіберу"
                          : language === "tg"
                            ? "Фиристодани мақола"
                            : "Submit Article"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
