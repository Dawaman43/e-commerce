import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Heart,
  Share2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { getProducts } from "@/api/product";
import type { Product } from "@/types/product";

function NewProduct() {
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [favorites, setFavorites] = useState(new Set<string>());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          page: 1,
          limit: 20,
          sortBy: "createdAt",
          order: "desc",
        });
        setProducts(response.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts: Product[] = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (product) =>
        filterType === "all" || (product.type || "sell") === filterType
    );

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // Share product (mock)
  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} for ${product.price}!`,
        url: window.location.origin + `/product/${product._id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${product.name} - ${product.price} - ${window.location.origin}/product/${product._id}`
      );
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-background to-muted/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-16 md:py-24 bg-gradient-to-br from-background to-muted/50"
      aria-label="Featured new products"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Fresh Finds Near You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the latest listings from local sellers. Something catch
            your eye? Filter and search to find your perfect match.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sell">For Sale</SelectItem>
              <SelectItem value="trade">Trade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        <p className="text-center text-muted-foreground mb-6">
          Showing {filteredProducts.length} of {products.length} fresh finds
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <article
              key={product._id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              role="article"
              aria-label={`${product.name} for ${product.price}`}
            >
              {/* Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={product.images?.[0] || "/default-product-image.png"}
                  alt={`${product.name} - ${product.type || "sell"}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <Badge variant="secondary" className="absolute top-2 right-2">
                  {(product.type || "sell").toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className="absolute top-2 left-2 text-xs"
                >
                  {product.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground text-lg line-clamp-2 flex-1 pr-2">
                    {product.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(product._id)}
                    className="p-1 h-6 w-6"
                    aria-label={`Toggle favorite for ${product.name}`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        favorites.has(product._id)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
                <p className="text-2xl font-bold text-primary mb-1">
                  {product.price}
                </p>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {product.location || "Unknown"} • @
                  {product.seller?.name || "Unknown Seller"}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.favorites || 0} favorites
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareProduct(product)}
                    className="p-1 h-6 w-6"
                    aria-label={`Share ${product.name}`}
                  >
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  asChild
                >
                  <a
                    href={`/product/${product._id}`}
                    className="flex items-center gap-1 text-foreground hover:text-primary"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        {filteredProducts.length > 0 ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <a href="/listings">
                Browse All New Listings ({products.length})
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            No products found. Try adjusting your search or filters.
          </p>
        )}
      </div>
    </section>
  );
}

export default NewProduct;
