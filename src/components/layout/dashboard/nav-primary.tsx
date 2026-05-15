import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { NavItem } from '@/lib/types'
import { Link } from '@tanstack/react-router'

type NavPrimaryProps = {
  navItems: NavItem[]
}

export function NavPrimary({ navItems }: NavPrimaryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton size="sm" asChild>
                <Link
                  to={item.to}
                  activeOptions={item.activeOptions}
                  activeProps={{ 'data-active': true }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
