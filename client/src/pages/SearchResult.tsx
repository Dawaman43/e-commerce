import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "@/api/product";
import type { Product } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const SearchResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No search query provided.");
      setLoading(false);
      return;
    }

    const decodedQuery = decodeURIComponent(id);
    setQuery(decodedQuery);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Assuming backend expects 'q' for search query; adjust if needed (e.g., 'search')
        const response = await getProducts({ q: decodedQuery });
        setProducts(response.products || []);
      } catch (err: any) {
        console.error("Failed to fetch search results:", err);
        setError("Failed to load search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
          {products.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {products.length} result{products.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms.
            </p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-0">
                  <img
                    src={product.images?.[0] || "/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg line-clamp-1 mb-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </CardDescription>
                  {product.category && (
                    <Badge variant="outline" className="mb-3">
                      {product.category}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/product/${product._id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
