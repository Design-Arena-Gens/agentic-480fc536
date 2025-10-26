import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Summarizer Agent',
  description: 'AI-powered email summarization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
