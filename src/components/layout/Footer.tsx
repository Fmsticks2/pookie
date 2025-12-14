import { Github, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 py-8 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
            Pookie
          </span>
          <p className="text-sm text-muted-foreground">
            The next-gen cross-chain prediction market.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        
        <div className="text-sm text-muted-foreground">
          © 2024 Pookie. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
