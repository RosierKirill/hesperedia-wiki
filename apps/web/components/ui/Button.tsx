'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const variants = {
  primary: 'bg-lumen-600 hover:bg-lumen-700 text-white border border-lumen-500 shadow-sm hover:shadow-lumen-500/20',
  secondary: 'bg-parchment-200 hover:bg-parchment-300 text-ink dark:bg-nihil-700 dark:hover:bg-nihil-600 dark:text-parchment-200 border border-parchment-400 dark:border-nihil-500',
  danger: 'bg-sanguis-700 hover:bg-sanguis-800 text-white border border-sanguis-600',
  ghost: 'bg-transparent hover:bg-parchment-200 dark:hover:bg-nihil-800 text-ink dark:text-parchment-200 border border-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, isLoading, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-ui font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumen-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
})
