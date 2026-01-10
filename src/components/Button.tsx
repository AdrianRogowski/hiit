import { type ButtonHTMLAttributes, type ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantStyles = {
  primary: 'bg-work text-white hover:bg-work/80 active:bg-work/60 shadow-glow-work',
  secondary: 'bg-surface text-text-primary hover:bg-surface-elevated active:bg-surface border border-text-secondary/20',
  danger: 'bg-error/20 text-error hover:bg-error/30 active:bg-error/40',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

/**
 * Reusable button component with variants
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`
        font-body font-semibold rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
