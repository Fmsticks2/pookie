import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Home } from 'lucide-react';

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
    <div className="space-y-2">
        <h1 className="text-6xl font-bold text-white tracking-tighter">404</h1>
        <p className="text-xl text-zinc-400">Page not found</p>
    </div>
    <Link to="/">
        <Button size="lg" className="gap-2">
            <Home className="w-4 h-4" /> Go Home
        </Button>
    </Link>
  </div>
);