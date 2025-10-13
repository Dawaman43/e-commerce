import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  ShoppingCart,
  Heart,
  Share,
  MapPin,
  Truck,
  MessageCircle,
  User,
  Calendar,
  DollarSign,
  Tag,
  Eye, // Added missing import
} from "lucide-react";

// Mock product data - replace with API fetch based on id (e.g., useQuery)
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

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      if (mockProducts[productId]) {
        setProduct(mockProducts[productId]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [productId]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product?.images.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product?.images.length || 1) - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The requested product does not exist.
          </p>
          <Button asChild>
            <a href="/listings">Browse All Listings</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section ref={ref} className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Images */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={handlePrevImage}
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={handleNextImage}
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {product.category}
                </Badge>
                <Badge variant="outline">{product.condition}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {product.price}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Sold by {product.seller}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Posted on {product.datePosted}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{product.views} views</span>
                <Heart className="w-4 h-4" />
                <span>{product.likes} likes</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-12 text-lg" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="ghost" size="lg" className="w-12">
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          className="mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </motion.div>

        {/* Seller Contact Section */}
        <motion.div
          className="mt-12 border-t pt-8"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Contact Seller
          </h3>
          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="lg">
              <Truck className="w-5 h-5 mr-2" />
              Arrange Pickup
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProductPage;
