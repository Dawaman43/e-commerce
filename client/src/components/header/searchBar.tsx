import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "@/api/product";
import type { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsResponse = await getProducts();
        setAllProducts(productsResponse.products);
      } catch (err: any) {
        console.error("Failed to load products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter((p: Product) =>
      p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setResults(filtered);
  }, [debouncedQuery, allProducts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/SearchResult/${encodeURIComponent(query)}`);
    }
  };

  const handleResultClick = (item: Product) => {
    setQuery(item.name);
    setResults([]);
    navigate(`/SearchResult/${encodeURIComponent(item.name)}`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  if (initialLoading) {
    return (
      <div className="w-full max-w-md mx-auto flex justify-center items-center p-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex gap-0 rounded-lg border border-input bg-background shadow-sm overflow-hidden focus-within:border-primary focus-within:shadow-md transition-shadow duration-200"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="pr-10 rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoComplete="off"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-9 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button
          type="submit"
          disabled={!query.trim()}
          className="rounded-l-none border-l border-input hover:bg-accent hover:border-primary transition-colors"
          size="default"
        >
          <Search className="h-4 w-4 mr-2" />
        </Button>
      </form>

      {error && (
        <Alert className="mt-2" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debouncedQuery && !loading && results.length === 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-background p-4 text-center text-muted-foreground rounded-md border border-border shadow-lg z-50">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span>No products found for "{debouncedQuery}".</span>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-background border rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto border-border">
          {results.map((item, index) => (
            <li
              key={item._id}
              className={`px-4 py-3 hover:bg-accent cursor-pointer flex items-center justify-between transition-colors ${
                index === 0 ? "border-t-0" : "border-t border-border"
              }`}
              onClick={() => handleResultClick(item)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.name}
                </p>
                {item.category && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {item.category}
                  </Badge>
                )}
              </div>
              {item.price && (
                <span className="text-foreground font-semibold ml-2 whitespace-nowrap">
                  ${item.price}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
