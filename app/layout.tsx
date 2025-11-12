import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Join OCLTA',
  description: 'Request access to the OCLTA network and community',
  icons: {
    icon: '/logos/app:icon.png',
    shortcut: '/logos/app:icon.png',
    apple: '/logos/app:icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-oclta-white dark:bg-oclta-black">
        {children}
      </body>
    </html>
  )
}
