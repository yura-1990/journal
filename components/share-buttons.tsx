"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Facebook, Twitter, Linkedin, Mail, LinkIcon, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface ShareButtonsProps {
  title: string
  url: string
  variant?: "button" | "icon"
}

export function ShareButtons({ title, url, variant = "button" }: ShareButtonsProps) {
  const { language } = useLanguage()
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url

  const handleShare = (platform: string) => {
    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(shareUrl)

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const t = {
    uz: {
      share: "Ulashish",
      copyLink: "Havolani nusxalash",
      copied: "Nusxalandi!",
    },
    ru: {
      share: "Поделиться",
      copyLink: "Скопировать ссылку",
      copied: "Скопировано!",
    },
    en: {
      share: "Share",
      copyLink: "Copy Link",
      copied: "Copied!",
    },
    ky: {
      share: "Бөлүшүү",
      copyLink: "Шилтемени көчүрүү",
      copied: "Көчүрүлдү!",
    },
    kk: {
      share: "Бөлісу",
      copyLink: "Сілтемені көшіру",
      copied: "Көшірілді!",
    },
    tg: {
      share: "Мубодила",
      copyLink: "Нусхабардории истинод",
      copied: "Нусхабардорӣ шуд!",
    },
  }[language]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "button" ? (
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            {t.share}
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")}>
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("email")}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
          {copied ? t.copied : t.copyLink}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
