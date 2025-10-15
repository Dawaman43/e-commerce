// components/layout/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import {
  Users,
  ShoppingBag,
  Handshake,
  DollarSign,
  AlertTriangle,
  MessageCircle,
  Bell,
  Home,
  Tag,
  Package,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  FileText,
  Bell as NotificationBell,
  Users as UsersIcon,
  Eye,
  Ban,
  ClipboardList,
  Edit3,
  Zap,
  Shield,
} from "lucide-react";
import { Separator } from "../ui/separator";

interface NavLink {
  id: number;
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavLink[];
}

function Sidebar() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || "user";

  // Toggle function for submenus
  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Dynamic nav links based on role with submenus
  const getNavLinks = (): NavLink[] => {
    const publicLinks: NavLink[] = [
      { id: 1, name: "Home", link: "/", icon: Home },
      { id: 2, name: "Categories", link: "/categories", icon: Tag },
      { id: 3, name: "Blog", link: "/blog", icon: FileText },
      { id: 4, name: "Contact", link: "/contact", icon: HelpCircle },
    ];

    const userLinks: NavLink[] = [
      { id: 1, name: "Home", link: "/", icon: Home },
      { id: 2, name: "Categories", link: "/categories", icon: Tag },
      { id: 3, name: "Sell", link: "/sell", icon: ShoppingBag },
      { id: 4, name: "My Orders", link: "/dashboard/orders", icon: Package },
      { id: 5, name: "Profile", link: "/profile", icon: UserIcon },
      {
        id: 6,
        name: "Account",
        link: "/account",
        icon: Settings,
        children: [
          {
            id: 61,
            name: "Profile Settings",
            link: "/profile",
            icon: UserIcon,
          },
          { id: 62, name: "Security", link: "/security", icon: Shield },
          { id: 63, name: "Billing", link: "/billing", icon: DollarSign },
        ],
      },
    ];

    const moderatorLinks: NavLink[] = [
      {
        id: 1,
        name: "Dashboard",
        link: "/moderator/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: 2,
        name: "Users",
        link: "/moderator/users",
        icon: UsersIcon,
        children: [
          { id: 21, name: "View Users", link: "/moderator/users", icon: Eye },
          {
            id: 22,
            name: "Moderate Actions",
            link: "/moderator/actions",
            icon: Zap,
          },
        ],
      },
      { id: 3, name: "Content", link: "/moderator/content", icon: FileText },
      {
        id: 4,
        name: "Reports",
        link: "/moderator/reports",
        icon: AlertTriangle,
        children: [
          {
            id: 41,
            name: "User Reports",
            link: "/moderator/reports/users",
            icon: UsersIcon,
          },
          {
            id: 42,
            name: "Content Reports",
            link: "/moderator/reports/content",
            icon: FileText,
          },
        ],
      },
      {
        id: 5,
        name: "Notifications",
        link: "/moderator/notifications",
        icon: NotificationBell,
      },
      { id: 6, name: "Settings", link: "/moderator/settings", icon: Settings },
    ];

    const adminLinks: NavLink[] = [
      {
        id: 1,
        name: "Dashboard",
        link: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: 2,
        name: "Users",
        link: "/admin/users",
        icon: UsersIcon,
        children: [
          { id: 21, name: "View All Users", link: "/admin/users", icon: Eye },
          { id: 22, name: "Ban Users", link: "/admin/users/ban", icon: Ban },
          {
            id: 23,
            name: "Roles Management",
            link: "/admin/users/roles",
            icon: UsersIcon,
          },
        ],
      },
      {
        id: 3,
        name: "Orders",
        link: "/admin/orders",
        icon: Package,
        children: [
          {
            id: 31,
            name: "View Orders",
            link: "/admin/orders",
            icon: ClipboardList,
          },
          {
            id: 32,
            name: "Disputes",
            link: "/admin/disputes",
            icon: AlertTriangle,
          },
        ],
      },
      {
        id: 4,
        name: "Content Management",
        link: "/admin/content",
        icon: FileText,
        children: [
          {
            id: 41,
            name: "Listings",
            link: "/admin/content/listings",
            icon: ShoppingBag,
          },
          {
            id: 42,
            name: "Categories",
            link: "/admin/content/categories",
            icon: Tag,
          },
          {
            id: 43,
            name: "Blog Posts",
            link: "/admin/content/blog",
            icon: Edit3,
          },
        ],
      },
      { id: 5, name: "Revenue", link: "/admin/revenue", icon: DollarSign },
      { id: 6, name: "Messages", link: "/admin/messages", icon: MessageCircle },
      {
        id: 7,
        name: "Notifications",
        link: "/admin/notifications",
        icon: NotificationBell,
      },
      { id: 8, name: "Settings", link: "/admin/settings", icon: Settings },
    ];

    return !user
      ? publicLinks
      : role === "admin"
      ? adminLinks
      : role === "moderator"
      ? moderatorLinks
      : userLinks;
  };

  const navLinks = getNavLinks();

  const isActive = (link: string) =>
    location.pathname === link || location.pathname.startsWith(link);

  const renderNavLink = (link: NavLink, level: number = 0) => {
    const Icon = link.icon;
    const hasChildren = link.children && link.children.length > 0;
    const isOpen = openSections.has(link.id);
    const active = isActive(link.link);

    return (
      <div key={link.id} className={cn("space-y-1", level > 0 && "ml-4")}>
        <Button
          variant={active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start transition-all duration-200 hover:bg-accent/50",
            level > 0 && "pl-8"
          )}
          onClick={(e) => {
            e.preventDefault();
            if (hasChildren) {
              toggleSection(link.id);
            } else if (link.link) {
              window.location.href = link.link; // Or use navigate if in React Router context
            }
          }}
        >
          <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-left flex-1">{link.name}</span>
          )}
          {hasChildren && !isCollapsed && (
            <ChevronDown
              className={cn(
                "h-4 w-4 ml-auto transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </Button>
        {hasChildren && isOpen && !isCollapsed && (
          <div className="space-y-1 ml-4">
            {link.children!.map((child) => renderNavLink(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] bg-card border-r shadow-sm flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header - No logo */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50">
        <div className="flex-1" /> {/* Empty space for alignment */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navLinks.map((nav) => renderNavLink(nav))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-card/50 space-y-2">
        {user && (
          <>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive/80",
                isCollapsed && "justify-center"
              )}
              onClick={logout}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
            <Separator />
          </>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center"
          )}
          onClick={() => window.open("/help", "_blank")}
        >
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Help</span>}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
