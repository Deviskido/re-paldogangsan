import type { Metadata } from 'next'

import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import '../styles/globals.css'



export const metadata: Metadata = {
  title: '팔도강산 - 지역의 좋은 것을 발견하세요',
  description: '지역 쇼핑몰 상품을 검색하고 지역과 카테고리로 둘러보세요',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var theme;try{theme=localStorage.getItem('paldogangsan-theme')}catch(e){}document.documentElement.classList.toggle('dark',theme==='dark'||(theme!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))})()` }} />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
