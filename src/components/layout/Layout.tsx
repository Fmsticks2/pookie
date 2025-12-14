import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Toaster } from 'sonner'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  )
}
