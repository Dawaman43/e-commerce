import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getProducts } from "@/api/product";
import type { Product } from "@/types/product";

function CategoryProductsPage() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("=== CATEGORY PRODUCTS DEBUG ===");
      console.log("Category ID from params:", id);
      if (!id) {
        console.log("No ID - setting error");
        setError("No category specified.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // ✅ Build query, skip falsy search ("" or "undefined")
        const query: Record<string, string> = { category: id };
        if (searchTerm && searchTerm.trim()) {
          // ✅ Only add if non-empty after trim
          query.search = searchTerm.trim();
        }
        console.log("Fetching products with query:", query);
        const response = await getProducts(query);
        console.log("Full API response:", response);
        console.log("Products array:", response.products);
        console.log(
          "Products length:",
          response.products ? response.products.length : 0
        );
        setProducts(response.products || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
        console.log("=== END DEBUG ===");
      }
    };

    fetchProducts();
  }, [id, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error || "No Products Found"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || `No products available in "${id}" category.`}
          </p>
          <Button asChild>
            <Link to="/categories">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryName = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
    : "Category";

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {categoryName} Products
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover amazing items in this category.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search within this category..."
                className="pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-muted">
                <img
                  src={
                    product.images[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <CardTitle className="text-lg font-semibold line-clamp-1">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {product.description || "No description available."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.stock && (
                    <Badge variant="outline" className="text-xs">
                      {product.stock} in stock
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Sold by {product.seller.name}
                </div>
                <Button asChild className="w-full">
                  <Link to={`/product/${product._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products match your search. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProductsPage;
