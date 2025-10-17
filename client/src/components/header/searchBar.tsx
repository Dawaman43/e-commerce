import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { getProducts } from "@/api/product";
import type { ProductsResponse } from "@/types/product";
import { Link } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ProductsResponse = await getProducts({ q: searchTerm });
        setProducts(response.products || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search input */}
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm overflow-hidden px-4 py-2">
        <input
          type="text"
          placeholder="Search a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
        />
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-200" />
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setShowDropdown(false)}
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
