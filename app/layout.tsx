import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Join OCLTA',
  description: 'Request access to the OCLTA network and community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-oclta-white">
        {children}
      </body>
    </html>
  )
}
