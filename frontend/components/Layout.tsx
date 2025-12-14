import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './UI';
import { useWallet } from '../hooks/useHooks';
import { cn, formatAddress } from '../utils';
import { LayoutDashboard, PlusCircle, Search, Wallet, BarChart3, Menu, X } from 'lucide-react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2ZM16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6ZM19.5 16C20.8807 16 22 14.8807 22 13.5C22 12.1193 20.8807 11 19.5 11H13V21H15V17H16V21H18V17H19.5ZM15 13H19.5C19.7761 13 20 13.2239 20 13.5C20 13.7761 19.7761 14 19.5 14H15V13Z" fill="#4f46e5"/>
  </svg>
);

const Navbar = () => {
  const { address, connect, disconnect, isConnected } = useWallet();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Markets', href: '/', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Portfolio', href: '/portfolio', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Create', href: '/create', icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-xl border border-border bg-surface/90 shadow-nav backdrop-blur-md">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="font-bold text-lg text-white tracking-tight">Pookie</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-surfaceHighlight/50 rounded-lg p-1 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  location.pathname === link.href 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-40 h-9 rounded-lg bg-surfaceHighlight border border-transparent focus:border-zinc-700 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all focus:w-48"
              />
            </div>

            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Balance</span>
                  <span className="text-xs font-mono font-medium text-white">2,405.32 USDC</span>
                </div>
                <Button variant="secondary" size="sm" onClick={disconnect} className="font-mono text-xs h-9">
                  <Wallet className="w-3 h-3 mr-2 text-zinc-400" />
                  {formatAddress(address!)}
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={connect} className="h-9">Connect Wallet</Button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-24 z-40 rounded-xl border border-border bg-surface shadow-2xl p-4 space-y-2 md:hidden animate-in slide-in-from-top-4 fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href ? "bg-primary text-white" : "text-zinc-400 hover:bg-surfaceHighlight hover:text-white"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-zinc-800">
             <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search markets..." 
                  className="w-full h-10 rounded-lg bg-surfaceHighlight border border-zinc-800 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary"
                />
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => (
  <footer className="border-t border-border bg-background mt-auto py-12">
    <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
           <Logo />
           <span className="font-bold text-white">Pookie</span>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">
          The next generation of prediction markets. Decentralized, cross-chain, and transparent.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-4">Platform</h4>
        <ul className="space-y-2 text-sm text-zinc-500">
          <li><Link to="/" className="hover:text-primary transition-colors">Markets</Link></li>
          <li><Link to="/create" className="hover:text-primary transition-colors">Create Event</Link></li>
          <li><Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-4">Resources</h4>
        <ul className="space-y-2 text-sm text-zinc-500">
          <li><Link to="/page/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
          <li><Link to="/page/api" className="hover:text-primary transition-colors">API</Link></li>
          <li><Link to="/page/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          <li><Link to="/page/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-4">Community</h4>
        <div className="flex gap-4">
           <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
           <a href="#" className="text-zinc-500 hover:text-white transition-colors">Telegram</a>
           <a href="#" className="text-zinc-500 hover:text-white transition-colors">Discord</a>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 max-w-5xl mt-12 pt-8 border-t border-border text-center text-xs text-zinc-600">
      © 2024 Pookie Markets. All rights reserved.
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};