import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  disabled?: boolean
}

function Button({ onClick, children, variant = 'primary', size = 'lg', disabled = false }: ButtonProps) {
  const base =
    'relative font-bold rounded-xl transition-all duration-200 ease-out select-none ' +
    'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary:
      'bg-gradient-to-b from-green-400 to-green-600 text-white ' +
      'hover:from-green-300 hover:to-green-500 ' +
      'shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:shadow-xl ' +
      'border border-green-400/30',
    secondary:
      'bg-white/10 text-white border border-white/20 ' +
      'hover:bg-white/20 hover:border-white/30 ' +
      'shadow-lg shadow-black/20',
  }

  const sizes = {
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-10 py-4 text-lg tracking-wide',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  )
}

export default Button
