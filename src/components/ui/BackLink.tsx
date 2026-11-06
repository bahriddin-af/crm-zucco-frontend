import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackLinkProps {
  to: string
  label: string
}

/** Tafsilot sahifalaridagi "ro'yxatga qaytish" havolasi. */
export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-xs text-caption hover:text-primary transition-colors">
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </Link>
  )
}
