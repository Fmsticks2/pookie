import { Link, useLocation } from 'react-router-dom'
import { WalletButton } from '@/components/WalletButton'
import { cn } from '@/lib/utils'

export function Navbar() {
  const location = useLocation()

  const navItems = [
    { label: 'Markets', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Create', href: '/create' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
            Pookie
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />
        </div>
      </div>
    </nav>
  )
}
