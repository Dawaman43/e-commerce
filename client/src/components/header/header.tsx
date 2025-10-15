import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import ToggleTheme from "../toggle-theme";
import SearchBar from "./searchBar";
import UserAvatar from "./userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavLink {
  id: number;
  name: string;
  link: string;
}

interface NavBarProps {
  links: NavLink[];
}

function NavBar({ links }: NavBarProps) {
  const location = useLocation();

  return (
    <NavigationMenu className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/80 to-transparent" />
      <NavigationMenuList className="relative flex space-x-8 backdrop-blur-sm">
        {links.map((nav) => {
          const isActive =
            location.pathname === nav.link ||
            location.pathname.startsWith(nav.link);
          return (
            <NavigationMenuItem key={nav.id}>
              <NavigationMenuLink asChild>
                <Link
                  to={nav.link}
                  className={cn(
                    "group relative inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium uppercase tracking-wide transition-all duration-300 ease-out hover:bg-accent/20 hover:text-accent-foreground focus:bg-accent/20 focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive && "text-primary shadow-lg shadow-primary/10"
                  )}
                >
                  <span className="relative z-10">{nav.name}</span>
                  <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5" />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out origin-left scale-x-0",
                      "group-hover:scale-x-100",
                      isActive && "scale-x-100"
                    )}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Assuming logout is available in useAuth
  const role = user?.role || "user";

  // Dynamic nav links based on authentication and role
  const getNavLinks = (): NavLink[] => {
    const publicLinks: NavLink[] = [
      { id: 1, name: "Categories", link: "/categories" },
      { id: 2, name: "Blog", link: "/blog" },
      { id: 3, name: "Contact Us", link: "/contact" },
    ];

    const userLinks: NavLink[] = [
      { id: 1, name: "Categories", link: "/categories" },
      { id: 2, name: "Sell", link: "/sell" },
      { id: 3, name: "Orders", link: "/dashboard/orders" },
    ];

    const moderatorLinks: NavLink[] = [
      { id: 1, name: "Dashboard", link: "/moderator/dashboard" },
      { id: 2, name: "Users", link: "/moderator/users" },
      { id: 3, name: "Content", link: "/moderator/content" },
      { id: 4, name: "Reports", link: "/moderator/reports" },
      { id: 5, name: "Notifications", link: "/moderator/notifications" },
    ];

    const adminLinks: NavLink[] = [
      { id: 1, name: "Dashboard", link: "/admin/dashboard" },
      { id: 2, name: "Users", link: "/admin/users" },
      { id: 3, name: "Orders", link: "/admin/orders" },
      { id: 4, name: "Content Management", link: "/admin/content" },
    ];

    return !user
      ? publicLinks
      : role === "admin"
      ? adminLinks
      : role === "moderator"
      ? moderatorLinks
      : userLinks;
  };

  const navBarLinks = getNavLinks();

  return (
    <header className="bg-background/80 dark:bg-background/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced with subtle icon and improved hover */}
          <Link
            to="/"
            className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300 ease-out flex-shrink-0"
          >
            <div className="text-2xl font-semibold flex flex-col whitespace-nowrap">
              <span className="text-3xl font-bold text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 leading-tight">
                Gebeya
              </span>
              <span className="text-sm font-medium text-muted-foreground leading-tight">
                Go
              </span>
            </div>
          </Link>

          {/* Desktop: Nav and Search - Centered with better spacing */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <NavBar links={navBarLinks} />
            <div className="relative flex-shrink-0 w-72">
              <SearchBar />
            </div>
          </div>

          {/* Right section: User actions - Enhanced with more shadcn components */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            <ToggleTheme />
            <UserAvatar />
          </div>

          {/* Mobile Menu Trigger - Refined with shadcn Button and icon */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 border-l-0 bg-background/95 backdrop-blur-md flex flex-col [&>button:last-child]:hidden"
            >
              {/* Mobile Menu Header - Improved with Badge for role */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <UserAvatar />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Mobile Menu Body - Enhanced with ScrollArea and Separators */}
              <ScrollArea className="flex-1">
                <div className="flex flex-col h-full space-y-4 p-4">
                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col space-y-1">
                    {navBarLinks.map((nav) => (
                      <Link
                        key={nav.id}
                        to={nav.link}
                        className="group block px-3 py-2.5 text-base font-medium text-foreground/80 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-in-out border-l-2 border-transparent hover:border-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {nav.name}
                      </Link>
                    ))}
                  </nav>

                  <Separator />

                  {/* Mobile Search */}
                  <div className="pt-2">
                    <SearchBar />
                  </div>

                  <Separator />

                  {/* Mobile User Actions */}
                  {user && (
                    <div className="flex flex-col space-y-2 pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link
                              to="/profile"
                              className="w-full cursor-pointer"
                            >
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                            className="focus:bg-destructive focus:text-destructive-foreground"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </Button>
                    </div>
                  )}

                  {/* Theme Toggle in Mobile */}
                  <div className="flex justify-center pt-4 border-t border-border">
                    <ToggleTheme />
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
