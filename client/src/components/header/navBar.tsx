import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const navBarLinks = [
  { id: 1, name: "Categories", link: "/categories" },
  { id: 2, name: "Orders", link: "/dashboard/orders" },
  { id: 3, name: "Contact Us", link: "/contact" },
];

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-3 px-6">
      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-6 font-semibold">
          {navBarLinks.map((nav) => (
            <NavigationMenuItem key={nav.id}>
              <NavigationMenuLink asChild>
                <Link to={nav.link}>{nav.name}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
