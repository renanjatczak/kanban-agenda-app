import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-white dark:bg-slate-700 px-3 py-2 text-sm',
        'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400',
        'outline-none transition-colors focus:ring-2 focus:ring-offset-0',
        error
          ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
          : 'border-gray-300 dark:border-slate-600 focus:border-indigo-400 focus:ring-indigo-200',
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = 'Input'
