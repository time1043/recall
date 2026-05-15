import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  title: string
  icon: LucideIcon
  // to: LinkProps['to']
  to: string
  activeOptions: { exact: boolean }
}
