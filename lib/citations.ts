// Citation export utilities for academic references
import type { Article } from "./storage"

export type CitationFormat = "bibtex" | "ris" | "endnote" | "apa" | "mla" | "chicago"

export function generateCitation(article: Article, format: CitationFormat, language: string): string {
  const langSuffix = language.charAt(0).toUpperCase() + language.slice(1)
  const title = (article[`title${langSuffix}` as keyof Article] as string) || article.titleEn
  const author = (article[`authorName${langSuffix}` as keyof Article] as string) || article.authorNameEn
  const year = new Date(article.publishedAt || article.submittedAt).getFullYear()

  switch (format) {
    case "bibtex":
      return generateBibTeX(article, title, author, year)
    case "ris":
      return generateRIS(article, title, author, year)
    case "endnote":
      return generateEndNote(article, title, author, year)
    case "apa":
      return generateAPA(article, title, author, year)
    case "mla":
      return generateMLA(article, title, author, year)
    case "chicago":
      return generateChicago(article, title, author, year)
    default:
      return generateAPA(article, title, author, year)
  }
}

function generateBibTeX(article: Article, title: string, author: string, year: number): string {
  const id = article.id.replace(/[^a-zA-Z0-9]/g, "")

  return `@article{${id},
  author = {${author}},
  title = {${title}},
  year = {${year}},
  journal = {Journal of Science and Education},
  volume = {1},
  number = {1},
  pages = {1--10},
  ${article.doi ? `doi = {${article.doi}},` : ""}
  keywords = {${article.keywordsEn}}
}`
}

function generateRIS(article: Article, title: string, author: string, year: number): string {
  const authorParts = author.split(" ")
  const lastName = authorParts[authorParts.length - 1]
  const firstNames = authorParts.slice(0, -1).join(" ")

  return `TY  - JOUR
AU  - ${lastName}, ${firstNames}
TI  - ${title}
JO  - Journal of Science and Education
PY  - ${year}
VL  - 1
IS  - 1
SP  - 1
EP  - 10
${article.doi ? `DO  - ${article.doi}` : ""}
KW  - ${article.keywordsEn}
ER  -`
}

function generateEndNote(article: Article, title: string, author: string, year: number): string {
  return `%0 Journal Article
%A ${author}
%T ${title}
%J Journal of Science and Education
%D ${year}
%V 1
%N 1
%P 1-10
${article.doi ? `%R ${article.doi}` : ""}
%K ${article.keywordsEn}`
}

function generateAPA(article: Article, title: string, author: string, year: number): string {
  return `${author} (${year}). ${title}. Journal of Science and Education, 1(1), 1-10.${article.doi ? ` https://doi.org/${article.doi}` : ""}`
}

function generateMLA(article: Article, title: string, author: string, year: number): string {
  return `${author}. "${title}." Journal of Science and Education, vol. 1, no. 1, ${year}, pp. 1-10.${article.doi ? ` doi:${article.doi}.` : ""}`
}

function generateChicago(article: Article, title: string, author: string, year: number): string {
  return `${author}. "${title}." Journal of Science and Education 1, no. 1 (${year}): 1-10.${article.doi ? ` https://doi.org/${article.doi}.` : ""}`
}

export function downloadCitation(article: Article, format: CitationFormat, language: string): void {
  const citation = generateCitation(article, format, language)
  const extension = format === "bibtex" ? "bib" : format === "ris" ? "ris" : "txt"
  const filename = `citation-${article.id}.${extension}`

  const blob = new Blob([citation], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyCitationToClipboard(article: Article, format: CitationFormat, language: string): Promise<void> {
  const citation = generateCitation(article, format, language)
  return navigator.clipboard.writeText(citation)
}
