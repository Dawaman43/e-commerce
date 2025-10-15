import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLink {
  id: number;
  name: string;
  link: string;
}

interface NavBarProps {
  links: NavLink[];
}

export default function NavBar({ links }: NavBarProps) {
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
