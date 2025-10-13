import { useState } from "react";
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
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";
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

// Mock data - replace with API fetch (e.g., sorted by total sales)
const mockSellers = [
  {
    id: 1,
    avatar: "/assets/seller1.jpg",
    name: "Alex Rivera",
    rating: 4.9,
    reviews: 127,
    sales: 89,
    location: "Brooklyn, NY",
    bio: "Electronics & gadgets specialist",
    verified: true,
  },
  {
    id: 2,
    avatar: "/assets/seller2.jpg",
    name: "Jordan Lee",
    rating: 5.0,
    reviews: 95,
    sales: 72,
    location: "Manhattan, NY",
    bio: "Vintage clothing curator",
    verified: false,
  },
  {
    id: 3,
    avatar: "/assets/seller3.jpg",
    name: "Taylor Kim",
    rating: 4.8,
    reviews: 156,
    sales: 110,
    location: "Queens, NY",
    bio: "Handmade crafts & art",
    verified: true,
  },
  {
    id: 4,
    avatar: "/assets/seller4.jpg",
    name: "Casey Patel",
    rating: 4.9,
    reviews: 203,
    sales: 145,
    location: "Harlem, NY",
    bio: "Bikes & outdoor gear",
    verified: true,
  },
  {
    id: 5,
    avatar: "/assets/seller5.jpg",
    name: "Riley Chen",
    rating: 4.7,
    reviews: 68,
    sales: 54,
    location: "Bronx, NY",
    bio: "Books & collectibles",
    verified: false,
  },
  {
    id: 6,
    avatar: "/assets/seller6.jpg",
    name: "Morgan Santos",
    rating: 5.0,
    reviews: 89,
    sales: 67,
    location: "Staten Island, NY",
    bio: "Home decor & furniture",
    verified: true,
  },
  {
    id: 7,
    avatar: "/assets/seller7.jpg",
    name: "Drew Nguyen",
    rating: 4.8,
    reviews: 112,
    sales: 91,
    location: "Upper East Side, NY",
    bio: "Tech accessories pro",
    verified: false,
  },
  {
    id: 8,
    avatar: "/assets/seller8.jpg",
    name: "Quinn Morales",
    rating: 4.9,
    reviews: 145,
    sales: 102,
    location: "Lower East Side, NY",
    bio: "Jewelry & accessories",
    verified: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

interface Seller {
  id: number;
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [favorites, setFavorites] = useState(new Set<number>());

  // Filtered sellers
  const filteredSellers: Seller[] = mockSellers
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
  const toggleFavorite = (id: number) => {
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

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 bg-gradient-to-br from-muted/20 to-background"
      aria-label="Top sellers in your community"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trusted Top Sellers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with our most reliable locals—vetted by thousands of happy
            trades. Search and filter to find your ideal match.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
        </motion.div>

        {/* Results Info */}
        <motion.p
          className="text-center text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Showing {filteredSellers.length} of {mockSellers.length} top sellers
        </motion.p>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredSellers.map((seller) => (
            <motion.article
              key={seller.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
              variants={cardVariants}
              whileHover={shouldReduceMotion ? {} : cardHoverVariants}
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
                  <motion.a
                    href={`/seller/${seller.id}`}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    className="flex items-center justify-center gap-2 text-foreground hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Seller
                  </motion.a>
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA Button */}
        {filteredSellers.length > 0 ? (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="rounded-xl px-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              asChild
            >
              <motion.a
                href="/sellers"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Explore All Sellers ({mockSellers.length})
              </motion.a>
            </Button>
          </motion.div>
        ) : (
          <motion.p
            className="text-center text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No sellers found. Try adjusting your search or filters.
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default TopSellers;
