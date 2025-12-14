import React from 'react';
import { cn } from '../utils';
import { Loader2 } from 'lucide-react';

// BUTTON
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, className, variant = 'primary', size = 'md', isLoading, disabled, type = 'button', ...props 
}) => {
  const variants = {
    primary: 'bg-primary hover:bg-primaryHover text-white border border-transparent shadow-sm',
    secondary: 'bg-surfaceHighlight hover:bg-zinc-800 text-white border border-border',
    outline: 'bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
    success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-semibold',
  };

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[1px]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// CARD
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('bg-surface border border-border rounded-xl overflow-hidden shadow-card', className)} {...props}>
      {children}
    </div>
  );
};

// INPUT
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-zinc-700 bg-surfaceHighlight px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// SELECT
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-zinc-700 bg-surfaceHighlight px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

// TEXTAREA
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-zinc-700 bg-surfaceHighlight px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// BADGE
export const Badge: React.FC<{ variant?: 'default' | 'outline' | 'success' | 'danger'; children: React.ReactNode; className?: string }> = ({ 
  variant = 'default', children, className 
}) => {
  const styles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    outline: 'border border-zinc-700 text-zinc-400',
    success: 'bg-emerald-950 text-emerald-500 border border-emerald-900',
    danger: 'bg-red-950 text-red-500 border border-red-900',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[variant], className)}>
      {children}
    </span>
  );
};

// SKELETON
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-zinc-800", className)} />
);

// MODAL/DIALOG
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};