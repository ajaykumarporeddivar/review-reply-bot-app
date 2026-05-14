import * as React from 'react'
import { cn } from '@/lib/utils'

export function Button({
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-zinc-900 text-white hover:bg-zinc-700',
        variant === 'secondary' && 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50',
        variant === 'ghost' && 'text-zinc-700 hover:bg-zinc-100',
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-zinc-200 bg-white p-5 shadow-sm', className)} {...props} />
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700', className)} {...props} />
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400', className)} {...props} />
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400', className)} {...props} />
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string | number
  detail?: string
}) {
  return (
    <Card>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p>
      {detail && <p className="mt-1 text-xs text-zinc-400">{detail}</p>}
    </Card>
  )
}

export function Modal({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">{children}</div>
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full border-collapse text-sm', className)} {...props} />
}
