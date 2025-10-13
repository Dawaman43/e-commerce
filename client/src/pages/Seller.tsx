import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  User,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  ShoppingBag,
  Heart,
  Eye,
  Award,
} from "lucide-react";

// Mock product data (shared or imported - for simplicity, duplicated subset)
const mockProducts: Record<number, Product> = {
  // Added explicit type for index signature
  4: {
    id: 4,
    title: "Vintage Vinyl Record Player",
    description:
      "A beautifully restored vintage vinyl record player from the 1970s. Perfect for audiophiles and collectors. Includes original stylus and dust cover.",
    price: "$150",
    category: "Electronics",
    condition: "Like New",
    location: "Brooklyn, NY",
    seller: "Alex Rivera",
    images: [
      "https://via.placeholder.com/600x400?text=Vintage+Vinyl+Record+Player",
      "https://via.placeholder.com/600x400?text=Side+View",
      "https://via.placeholder.com/600x400?text=Details",
    ],
    datePosted: "Oct 10, 2025",
    views: 245,
    likes: 12,
  },
  5: {
    id: 5,
    title: "Wireless Gaming Headset",
    description:
      "High-quality wireless gaming headset with noise cancellation and 20-hour battery life. Compatible with PC, PS5, and Xbox. Comes with extra ear cushions.",
    price: "Trade for PS5 or $80",
    category: "Gaming",
    condition: "Excellent",
    location: "Manhattan, NY",
    seller: "Jordan Lee",
    images: [
      "https://via.placeholder.com/600x400?text=Wireless+Gaming+Headset",
      "https://via.placeholder.com/600x400?text=Comfort+Fit",
      "https://via.placeholder.com/600x400?text=Mic+View",
    ],
    datePosted: "Oct 12, 2025",
    views: 189,
    likes: 8,
  },
  // Additional mock products for more sellers
  6: {
    id: 6,
    title: "Handmade Ceramic Mug Set",
    description: "Set of 4 unique handmade ceramic mugs, dishwasher safe.",
    price: "$25",
    category: "Home & Garden",
    condition: "New",
    location: "Queens, NY",
    seller: "Taylor Kim",
    images: [
      "https://via.placeholder.com/600x400?text=Handmade+Ceramic+Mug+Set",
    ],
    datePosted: "Oct 9, 2025",
    views: 156,
    likes: 5,
  },
  7: {
    id: 7,
    title: "Mountain Bike - Like New",
    description: "22-speed mountain bike, barely used, includes helmet.",
    price: "$300",
    category: "Sports",
    condition: "Like New",
    location: "Harlem, NY",
    seller: "Casey Patel",
    images: ["https://via.placeholder.com/600x400?text=Mountain+Bike"],
    datePosted: "Oct 11, 2025",
    views: 312,
    likes: 18,
  },
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  seller: string;
  images: string[];
  datePosted: string;
  views: number;
  likes: number;
};

// Mock seller data
type Seller = {
  id: number;
  name: string;
  bio: string;
  location: string;
  joinedDate: string;
  rating: number;
  totalListings: number;
  profileImage: string;
  listings: number[]; // product ids
};

const mockSellers: Record<number, Seller> = {
  2: {
    id: 2,
    name: "Jordan Lee",
    bio: "Passionate gamer and tech enthusiast. Specializing in gaming gear and electronics trades. Always up for a fair deal!",
    location: "Manhattan, NY",
    joinedDate: "January 2024",
    rating: 4.9,
    totalListings: 3,
    profileImage: "https://via.placeholder.com/150?text=JL",
    listings: [5],
  },
  4: {
    id: 4,
    name: "Alex Rivera",
    bio: "Vintage collector with a love for audio equipment. Restoring classics since 2010. Check out my curated selection!",
    location: "Brooklyn, NY",
    joinedDate: "March 2023",
    rating: 4.7,
    totalListings: 4,
    profileImage: "https://via.placeholder.com/150?text=AR",
    listings: [4],
  },
  // Add more as needed
  3: {
    id: 3,
    name: "Taylor Kim",
    bio: "Artisan crafter creating one-of-a-kind pottery. Sustainable materials, inspired by nature.",
    location: "Queens, NY",
    joinedDate: "June 2024",
    rating: 5.0,
    totalListings: 2,
    profileImage: "https://via.placeholder.com/150?text=TK",
    listings: [6],
  },
  5: {
    id: 5,
    name: "Casey Patel",
    bio: "Fitness junkie selling quality sports gear. No lowballs, serious buyers only.",
    location: "Harlem, NY",
    joinedDate: "September 2023",
    rating: 4.6,
    totalListings: 5,
    profileImage: "https://via.placeholder.com/150?text=CP",
    listings: [7],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SellerPage() {
  const { id } = useParams<{ id: string }>();
  const sellerId = id ? parseInt(id, 10) : 0;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      if (mockSellers[sellerId]) {
        setSeller(mockSellers[sellerId]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sellerId]);

  const sellerListings = seller?.listings
    ? seller.listings.map((pid) => mockProducts[pid]).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Seller Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The requested seller does not exist.
          </p>
          <Button asChild>
            <a href="/sellers">Browse All Sellers</a>
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section ref={ref} className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Seller Profile Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <img
              src={seller.profileImage}
              alt={seller.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {seller.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {renderStars(seller.rating)}
                <span className="text-sm text-muted-foreground">
                  {seller.rating} ({seller.totalListings} listings)
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {seller.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
          {seller.bio && (
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                {seller.bio}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <Button size="lg" className="flex-1 sm:w-auto">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-4 h-4 mr-2" />
              Follow
            </Button>
          </div>
        </motion.div>

        {/* Listings */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {seller.name}'s Listings ({sellerListings.length})
            </h2>
            <Badge variant="secondary">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          {sellerListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerListings.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <a href={`/product/${product.id}`} className="block">
                    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-primary">
                            {product.price}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            <span>{product.views}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          {product.condition}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Award className="w-3 h-3" />
                          <span>{product.category}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No listings available at the moment.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default SellerPage;
