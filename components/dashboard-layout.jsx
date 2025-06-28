"use client"

import PropTypes from "prop-types"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { RoleBasedSidebar } from "@/components/role-based-sidebar"
import { UserNav } from "@/components/user-nav"

/**
 * Main dashboard layout component that wraps the application content
 * Provides the sidebar and top navigation bar
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the layout
 * @param {string} props.role - User role (admin, team, or evaluator)
 * @param {string} props.userName - User's display name
 * @param {string} props.userEmail - User's email address
 * @returns {JSX.Element} Dashboard layout component
 */
export function DashboardLayout({ children, role , userName , userEmail }) {
  return (
    <SidebarProvider defaultOpen>
      <RoleBasedSidebar role={role} userName={userName} userEmail={userEmail} />
      <SidebarInset>
        <div className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex-1" />
          <UserNav userName={userName} userEmail={userEmail} />
        </div>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Prop validation
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(["admin", "team", "evaluator"]),
  userName: PropTypes.string,
  userEmail: PropTypes.string,
}
