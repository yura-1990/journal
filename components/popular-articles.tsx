"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import { getTopArticles } from "@/lib/analytics"
import Link from "next/link"

export function PopularArticles({ limit = 5 }: { limit?: number }) {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    setArticles(getTopArticles(limit))
  }, [limit])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Articles</CardTitle>
        <CardDescription>Top articles by views</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="block">
              <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                <Badge className="mt-1" variant="outline">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium leading-tight">{article.title}</p>
                  <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {article.downloads}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
