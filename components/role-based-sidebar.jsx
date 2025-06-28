"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import PropTypes from "prop-types"
import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  FileVideo,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Users,
  Video,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
  import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

/**
 * Role-based sidebar navigation component that adapts based on user role
 *
 * @param {Object} props - Component props
 * @param {string} props.role - User role (admin, team, or evaluator)
 * @param {string} props.userName - User's display name
 * @param {string} props.userEmail - User's email address
 * @returns {JSX.Element} Sidebar component
 */
export function RoleBasedSidebar({ role, userName, userEmail }) {
  const pathname = usePathname()

  // Navigation items based on user role
  const getNavItems = (role) => {
    const commonItems = [
      {
        title: "Dashboard",
        href: `/${role}`,
        icon: Home,
      },
      {
        title: "Settings",
        href: `/${role}/settings`,
        icon: Settings,
      },
    ]

    if (role === "admin") {
      return [
        ...commonItems,
        {
          title: "Evaluator Management",
          href: "/admin/evaluators",
          icon: Shield,
        },
        {
          title: "Team Submissions",
          href: "/admin/submissions",
          icon: FileVideo,
        },
        {
          title: "Evaluation Summary",
          href: "/admin/evaluations",
          icon: ClipboardList,
        },
        {
          title: "Leaderboard Control",
          href: "/admin/leaderboard",
          icon: BarChart3,
        },
        {
          title: "Support Chat",
          href: "/admin/support",
          icon: MessageSquare,
        },
      ]
    } else if (role === "team") {
      return [
        ...commonItems,
        {
          title: "Submit Project",
          href: "/team/submit",
          icon: FileVideo,
        },
        {
          title: "Feedback",
          href: "/team/feedback",
          icon: ClipboardList,
        },
        {
          title: "Leaderboard",
          href: "/team/leaderboard",
          icon: BarChart3,
        },
        {
          title: "Support Chat",
          href: "/team/support",
          icon: MessageSquare,
        },
      ]
    } else {
      // Evaluator
      return [
        ...commonItems,
        {
          title: "Assigned Videos",
          href: "/evaluator/videos",
          icon: Video,
        },
        {
          title: "Completed Evaluations",
          href: "/evaluator/completed",
          icon: CheckCircle,
        },
      ]
    }
  }
  const navItems = getNavItems(role)


  // Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "team":
        return "Team Member"
      case "evaluator":
        return "Evaluator"
      default:
        return "User"
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Evaluation System</span>
            <span className="text-xs text-muted-foreground">{getRoleDisplay(role)}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarSeparator />
      <SidebarFooter>
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${userName}`} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-sm">
                  <span className="font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${role}/profile`}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${role}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  )
}

// Prop validation
RoleBasedSidebar.propTypes = {
  role: PropTypes.oneOf(["admin", "team", "evaluator"]).isRequired,
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
}
