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
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-8">
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
                    "group relative inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]]:bg-accent/50",
                    isActive &&
                      "bg-accent/70 text-accent-foreground border-b-2 border-primary"
                  )}
                >
                  <span className="relative z-10">{nav.name}</span>
                  <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full scale-75" />
                  )}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
