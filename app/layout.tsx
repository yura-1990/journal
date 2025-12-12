import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/lib/language-context"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { BackToTop } from "@/components/back-to-top"
import Script from "next/script"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Progressive Science and Research | International Scientific Journal",
  description:
    "International scientific and practical journal publishing peer-reviewed research across all disciplines. Monthly publication with open access.",
  keywords: ["scientific journal", "research publication", "peer review", "academic journal", "international journal"],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="cleanup-storage"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var VERSION_KEY = 'journal_data_version';
                  var CURRENT_VERSION = '4';
                  var version = localStorage.getItem(VERSION_KEY);
                  
                  if (version !== CURRENT_VERSION) {
                    console.log('[v0] Clearing all journal data...');
                    
                    var keys = Object.keys(localStorage);
                    for (var i = 0; i < keys.length; i++) {
                      var key = keys[i];
                      if (key.indexOf('journal') !== -1 || key.indexOf('article') !== -1 || key.indexOf('issue') !== -1) {
                        localStorage.removeItem(key);
                      }
                    }
                    
                    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
                    console.log('[v0] Data cleared successfully');
                  }
                } catch (e) {
                  console.error('[v0] Cleanup error:', e);
                  try {
                    localStorage.clear();
                  } catch (err) {
                    console.error('[v0] Cannot clear storage:', err);
                  }
                }
              })();
            `,
          }}
        />
        <Script
          id="init-mock-data"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('mockDataInitialized') !== 'true') {
                    console.log('[v0] Mock data will be initialized by client component');
                  }
                } catch (e) {
                  console.error('[v0] Mock data check error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <BackToTop />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
