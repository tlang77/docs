import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-700 hover:bg-emerald-800 text-white',
  secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900',
  outline: 'border border-stone-300 hover:bg-stone-50 text-stone-700',
  ghost: 'hover:bg-stone-100 text-stone-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        clsx('inline-flex items-center justify-center font-medium transition disabled:opacity-60 disabled:cursor-not-allowed', variants[variant], sizes[size], className)
      )}
    >
      {children}
    </button>
  )
}
