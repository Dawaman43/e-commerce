import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ToggleTheme from "../toggle-theme";
import SearchBar from "./searchBar";
import UserAvatar from "./userAvatar";
import NavBar from "./navBar";

const navBarLinks = [
  { id: 1, name: "Categories", link: "/categories" },
  { id: 2, name: "Orders", link: "/orders" },
  { id: 3, name: "Contact Us", link: "/contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Ensured visibility with flex-shrink-0 */}
          <Link
            to="/"
            className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200 flex-shrink-0"
          >
            <div className="text-2xl font-semibold flex flex-col whitespace-nowrap">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
                Gebeya
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
                Go
              </span>
            </div>
          </Link>

          {/* Desktop: Nav and Search */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <NavBar />
            <div className="relative flex-shrink-0">
              <SearchBar />
            </div>
          </div>

          {/* Right section: User actions - visible on sm and up, with flex-shrink-0 */}
          <div className="hidden sm:flex items-center space-x-4 flex-shrink-0">
            <UserAvatar />
            <ToggleTheme />
          </div>

          {/* Mobile Menu Trigger - Animated Hamburger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex flex-col justify-center items-center space-y-1 p-2 -mr-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200 flex-shrink-0"
              >
                <span className="sr-only">Toggle menu</span>
                <span
                  className={`block w-6 h-0.5 bg-current transform transition-transform duration-200 ease-in-out ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-opacity duration-200 ease-in-out ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transform transition-transform duration-200 ease-in-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 border-l-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col"
            >
              {/* Mobile Menu Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
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

              {/* Mobile Menu Body */}
              <div className="flex flex-col h-full space-y-4 p-4 overflow-y-auto">
                {/* Mobile Nav Links - Vertical with active states */}
                <nav className="flex flex-col space-y-1">
                  {navBarLinks.map((nav) => (
                    <Link
                      key={nav.id}
                      to={nav.link}
                      className="group block px-3 py-2 text-base font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out group-hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="relative">
                        {nav.name}
                        <span className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                      </span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile Search with border */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <SearchBar />
                </div>

                {/* Mobile User Actions with border */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <UserAvatar />
                  <ToggleTheme />
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
