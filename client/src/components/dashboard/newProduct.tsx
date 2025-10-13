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
import { easeOut, motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Search,
  Filter,
  Heart,
  Share2,
  MapPin,
} from "lucide-react";

// Mock data - replace with your API fetch
const mockProducts: Product[] = [
  {
    id: 1,
    image: "/assets/product1.jpg",
    title: "Vintage Vinyl Record Player",
    price: "$150",
    type: "sell",
    location: "Brooklyn, NY",
    seller: "jane_doe",
    category: "Electronics",
    favorites: 12,
  },
  {
    id: 2,
    image: "/assets/product2.jpg",
    title: "Wireless Gaming Headset",
    price: "Trade for PS5",
    type: "trade",
    location: "Manhattan, NY",
    seller: "tech_guy88",
    category: "Electronics",
    favorites: 8,
  },
  {
    id: 3,
    image: "/assets/product3.jpg",
    title: "Handmade Ceramic Mug Set",
    price: "$25",
    type: "sell",
    location: "Queens, NY",
    seller: "crafty_mom",
    category: "Home & Garden",
    favorites: 5,
  },
  {
    id: 4,
    image: "/assets/product4.jpg",
    title: "Mountain Bike - Like New",
    price: "$300",
    type: "sell",
    location: "Harlem, NY",
    seller: "bike_enthusiast",
    category: "Sports",
    favorites: 23,
  },
  {
    id: 5,
    image: "/assets/product5.jpg",
    title: "Leather Jacket (Size M)",
    price: "Best Offer",
    type: "sell",
    location: "Bronx, NY",
    seller: "fashionista22",
    category: "Fashion",
    favorites: 17,
  },
  {
    id: 6,
    image: "/assets/product6.jpg",
    title: "Acoustic Guitar",
    price: "Trade for Amp",
    type: "trade",
    location: "Staten Island, NY",
    seller: "music_lover",
    category: "Music",
    favorites: 9,
  },
  {
    id: 7,
    image: "/assets/product7.jpg",
    title: "Smartphone Case - Custom Design",
    price: "$15",
    type: "sell",
    location: "Brooklyn, NY",
    seller: "designer_kid",
    category: "Electronics",
    favorites: 3,
  },
  {
    id: 8,
    image: "/assets/product8.jpg",
    title: "Yoga Mat - Eco-Friendly",
    price: "Trade for Workout Gear",
    type: "trade",
    location: "Manhattan, NY",
    seller: "yoga_pro",
    category: "Sports",
    favorites: 6,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

const cardHoverVariants = {
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
  type: "sell" | "trade";
  location: string;
  seller: string;
  category: string;
  favorites: number;
}

function NewProduct() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [favorites, setFavorites] = useState(new Set<number>());

  // Filtered products
  const filteredProducts: Product[] = mockProducts
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => filterType === "all" || product.type === filterType);

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

  // Share product (mock)
  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} for ${product.price}!`,
        url: window.location.origin + `/product/${product.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${product.title} - ${product.price} - ${window.location.origin}/product/${product.id}`
      );
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 bg-gradient-to-br from-background to-muted/50"
      aria-label="Featured new products"
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
            Fresh Finds Near You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the latest listings from local sellers. Something catch
            your eye? Filter and search to find your perfect match.
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
        </motion.div>

        {/* Results Info */}
        <motion.p
          className="text-center text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Showing {filteredProducts.length} of {mockProducts.length} fresh finds
        </motion.p>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredProducts.map((product) => (
            <motion.article
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              variants={cardVariants}
              whileHover={shouldReduceMotion ? {} : cardHoverVariants}
              role="article"
              aria-label={`${product.title} for ${product.price}`}
            >
              {/* Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={`${product.title} - ${product.type}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <Badge variant="secondary" className="absolute top-2 right-2">
                  {product.type.toUpperCase()}
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
                    {product.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1 h-6 w-6"
                    aria-label={`Toggle favorite for ${product.title}`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        favorites.has(product.id)
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
                  {product.location} • @{product.seller}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.favorites} favorites
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareProduct(product)}
                    className="p-1 h-6 w-6"
                    aria-label={`Share ${product.title}`}
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
                  <motion.a
                    href={`/product/${product.id}`}
                    whileHover={shouldReduceMotion ? {} : { x: 4 }}
                    className="flex items-center gap-1 text-foreground hover:text-primary"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </Button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA Button */}
        {filteredProducts.length > 0 ? (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <motion.a
                href="/listings"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Browse All New Listings ({mockProducts.length})
              </motion.a>
            </Button>
          </motion.div>
        ) : (
          <motion.p
            className="text-center text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No products found. Try adjusting your search or filters.
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default NewProduct;
