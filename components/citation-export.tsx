"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Quote, Download, Copy, Check } from "lucide-react"
import type { Article } from "@/lib/storage"
import { generateCitation, downloadCitation, copyCitationToClipboard, type CitationFormat } from "@/lib/citations"
import { useLanguage } from "@/lib/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CitationExportProps {
  article: Article
  variant?: "button" | "icon"
}

export function CitationExport({ article, variant = "button" }: CitationExportProps) {
  const { language } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCopy = async (format: CitationFormat) => {
    await copyCitationToClipboard(article, format, language)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (format: CitationFormat) => {
    downloadCitation(article, format, language)
  }

  const t = {
    uz: {
      cite: "Iqtibos keltirish",
      exportCitation: "Iqtibasni eksport qilish",
      copyToClipboard: "Buferga nusxalash",
      download: "Yuklash",
      copied: "Nusxalandi!",
      formats: "Formatlar",
      preview: "Ko'rish",
    },
    ru: {
      cite: "Цитировать",
      exportCitation: "Экспорт цитирования",
      copyToClipboard: "Скопировать",
      download: "Скачать",
      copied: "Скопировано!",
      formats: "Форматы",
      preview: "Предпросмотр",
    },
    en: {
      cite: "Cite",
      exportCitation: "Export Citation",
      copyToClipboard: "Copy to Clipboard",
      download: "Download",
      copied: "Copied!",
      formats: "Formats",
      preview: "Preview",
    },
    ky: {
      cite: "Цитата келтирүү",
      exportCitation: "Цитатаны экспорттоо",
      copyToClipboard: "Көчүрүү",
      download: "Жүктөө",
      copied: "Көчүрүлдү!",
      formats: "Форматтар",
      preview: "Көрүү",
    },
    kk: {
      cite: "Дәйексөз келтіру",
      exportCitation: "Дәйексөзді экспорттау",
      copyToClipboard: "Көшіру",
      download: "Жүктеу",
      copied: "Көшірілді!",
      formats: "Форматтар",
      preview: "Алдын ала қарау",
    },
    tg: {
      cite: "Иқтибос овардан",
      exportCitation: "Экспорти иқтибос",
      copyToClipboard: "Нусхабардорӣ",
      download: "Боргирӣ",
      copied: "Нусхабардорӣ шуд!",
      formats: "Форматҳо",
      preview: "Пешнамоиш",
    },
  }[language]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "button" ? (
          <Button variant="outline" size="sm">
            <Quote className="mr-2 h-4 w-4" />
            {t.cite}
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Quote className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.exportCitation}</DialogTitle>
          <DialogDescription>
            {article[`title${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Article] as string}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="apa" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="apa">APA</TabsTrigger>
            <TabsTrigger value="mla">MLA</TabsTrigger>
            <TabsTrigger value="chicago">Chicago</TabsTrigger>
            <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
            <TabsTrigger value="ris">RIS</TabsTrigger>
            <TabsTrigger value="endnote">EndNote</TabsTrigger>
          </TabsList>

          {(["apa", "mla", "chicago", "bibtex", "ris", "endnote"] as CitationFormat[]).map((format) => (
            <TabsContent key={format} value={format} className="space-y-4">
              <div className="rounded-lg border bg-muted p-4">
                <pre className="whitespace-pre-wrap text-sm">{generateCitation(article, format, language)}</pre>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleCopy(format)}>
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? t.copied : t.copyToClipboard}
                </Button>
                <Button variant="default" className="flex-1" onClick={() => handleDownload(format)}>
                  <Download className="mr-2 h-4 w-4" />
                  {t.download}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
