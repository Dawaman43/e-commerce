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
  Star,
  Users,
  MapPin,
  MessageCircle,
  Search,
  Filter,
  Heart,
  Crown,
} from "lucide-react"; // Lucide icons for ratings/stats
import { getTopSellers } from "@/api/product";

interface Seller {
  id: string;
  avatar: string;
  name: string;
  rating: number;
  reviews: number;
  sales: number;
  location: string;
  bio: string;
  verified: boolean;
}

function TopSellers() {
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [favorites, setFavorites] = useState(new Set<string>());
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await getTopSellers();
        setSellers(response.sellers || []);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  // Filtered sellers
  const filteredSellers: Seller[] = sellers
    .filter(
      (seller) =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.bio.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (seller) =>
        filterRating === "all" ||
        (filterRating === "4.5+" && seller.rating >= 4.5) ||
        (filterRating === "verified" && seller.verified)
    )
    .sort((a, b) => b.rating - a.rating); // Sort by rating descending

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

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-16 md:py-24 bg-gradient-to-br from-muted/20 to-background"
      aria-label="Top sellers in your community"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trusted Top Sellers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with our most reliable locals—vetted by thousands of happy
            trades. Search and filter to find your ideal match.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sellers</SelectItem>
              <SelectItem value="4.5+">4.5+ Stars</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        <p className="text-center text-muted-foreground mb-6">
          Showing {filteredSellers.length} of {sellers.length} top sellers
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredSellers.map((seller) => (
            <article
              key={seller.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
              role="article"
              aria-label={`Seller ${seller.name}, rated ${seller.rating}/5 with ${seller.reviews} reviews`}
            >
              {/* Avatar & Badge */}
              <div className="relative p-6 pb-4 text-center">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                  loading="lazy"
                />
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Crown className="w-3 h-3" />
                  Top Seller
                </div>
                {seller.verified && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 text-xs"
                  >
                    Verified
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(seller.id)}
                  className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Toggle favorite for ${seller.name}`}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.has(seller.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <h3 className="font-semibold text-foreground text-lg mb-2 text-center">
                  {seller.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {seller.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({seller.reviews} reviews)
                  </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{seller.sales}+ items sold</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.location}</span>
                  </div>
                  <p className="text-xs italic text-center">{seller.bio}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-lg border-border hover:bg-primary/5 transition-colors"
                  asChild
                >
                  <a
                    href={`/seller/${seller.id}`}
                    className="flex items-center justify-center gap-2 text-foreground hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Seller
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        {filteredSellers.length > 0 ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-xl px-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              asChild
            >
              <a href="/sellers">Explore All Sellers ({sellers.length})</a>
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            No sellers found. Try adjusting your search or filters.
          </p>
        )}
      </div>
    </section>
  );
}

export default TopSellers;
