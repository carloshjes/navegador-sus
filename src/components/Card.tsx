import type { HTMLAttributes } from 'react'

/**
 * Plain content container. Rendered as a <div> on purpose: the semantic
 * element (article/section/li) is the caller's decision — pass content
 * with its own heading inside.
 */
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-edge bg-surface p-4 shadow-resting ${className}`}
      {...props}
    />
  )
}
