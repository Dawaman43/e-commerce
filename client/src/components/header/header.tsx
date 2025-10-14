import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import ToggleTheme from "../toggle-theme";
import SearchBar from "./searchBar";
import UserAvatar from "./userAvatar";
import NavBar from "./navBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavLink {
  id: number;
  name: string;
  link: string;
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
      { id: 1, name: "Profile", link: "/profile" },
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
            <div className="relative inline-flex items-center justify-center w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
              <span className="text-xl font-bold text-primary">G</span>
            </div>
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

          {/* Right section: User actions - Enhanced dropdown integration */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            <ToggleTheme />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start space-x-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground capitalize">
                        {role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="px-4">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger - Refined hamburger with better animation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex flex-col justify-center items-center space-y-1.5 p-2 -mr-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50 transition-all duration-200 ease-in-out flex-shrink-0"
              >
                <span className="sr-only">Toggle menu</span>
                <span
                  className={`block w-6 h-0.5 bg-current origin-left transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "rotate-45 translate-y-2 opacity-75"
                      : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current origin-left transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "-rotate-45 -translate-y-2 opacity-75"
                      : "opacity-100"
                  }`}
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 border-l-0 bg-background/95 backdrop-blur-md flex flex-col"
            >
              {/* Mobile Menu Header - Improved with logout option */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  {user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  {user && (
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {role}
                      </p>
                    </div>
                  )}
                </div>
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

              {/* Mobile Menu Body - Better organization with sections */}
              <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto">
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

                {/* Mobile Search */}
                <div className="pt-2 border-t border-border">
                  <SearchBar />
                </div>

                {/* Mobile User Actions */}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <ToggleTheme />
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link to="/profile">View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
