import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  ShoppingCart,
  Heart,
  Share,
  MessageCircle,
  User,
  Calendar,
  Tag,
  Truck,
  Loader2,
} from "lucide-react";
import { getProductById } from "@/api/product";
import { addCartItem, removeCartItem, getCart } from "@/api/cart";
import { toast } from "sonner";
import type { Product } from "@/types/product";

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

const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case "bank_transfer":
      return "Bank Transfer";
    case "telebirr":
      return "TeleBirr";
    case "mepesa":
      return "MePeSa";
    default:
      return method;
  }
};

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [inCart, setInCart] = useState(false);

  // ✅ ADD DEBUG LOG: Component mount
  console.log("=== PRODUCT PAGE DEBUG ===");
  console.log("Component mounted with ID:", id);
  console.log("Ref in view:", isInView);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("=== FETCH EFFECT TRIGGERED ===");
      console.log("ID from params:", id);
      if (!id) {
        console.log("No ID - setting error");
        setError("No product ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Calling getProductById with ID:", id);
        const response = await getProductById(id);
        console.log("API Response:", response);
        console.log("Product from response:", response.product);
        setProduct(response.product);
        if (!response.product) {
          console.log("No product in response - setting error");
          setError("Product not found in API response.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load product: ${errorMessage}`);
      } finally {
        setLoading(false);
        console.log("Loading set to false");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) {
      setInCart(false);
      return;
    }

    const fetchCartStatus = async () => {
      try {
        const res = await getCart();
        const items = res.cart?.items || [];
        setInCart(items.some((item) => item.product._id === id));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setInCart(false);
      }
    };

    fetchCartStatus();
  }, [id]);

  const handleToggleCart = async () => {
    if (!id || !product) return;

    try {
      setAdding(true);
      if (inCart) {
        await removeCartItem(id);
        toast.success("Removed from cart!");
      } else {
        await addCartItem({ productId: id, quantity: 1 });
        toast.success("Product added to cart!");
      }
      setInCart(!inCart);
    } catch (err) {
      console.error("Failed to toggle cart:", err);
      toast.error(
        inCart ? "Failed to remove from cart." : "Failed to add to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product?.images.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (product?.images.length || 1) - 1 : prev - 1
    );
  };

  // ✅ ADD DEBUG LOG: Render states + FULL PRODUCT DATA
  console.log(
    "Render - Loading:",
    loading,
    "Error:",
    error,
    "Product exists:",
    !!product
  );
  if (product) {
    console.log("Full product data:", {
      name: product.name,
      price: product.price,
      images: product.images,
      description: product.description,
      seller: product.seller,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
    });
  }

  if (loading) {
    console.log("Rendering LOADING spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    console.log("Rendering ERROR/Not Found");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error || "Product Not Found"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error || "The requested product does not exist."}
          </p>
          <Button asChild>
            <a href="/listings">Browse All Listings</a>
          </Button>
        </div>
      </div>
    );
  }

  console.log("Rendering PRODUCT content");
  const formattedDate = new Date(
    product.createdAt || new Date()
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section ref={ref} className="py-8 md:py-12 bg-background min-h-screen">
      {" "}
      {/* ✅ Added min-h-screen for visibility */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible" // ✅ Force visible for testing (remove isInView dep)
        >
          {/* Images */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="relative bg-gray-200 rounded-lg shadow-lg overflow-hidden">
              {" "}
              {/* ✅ Fallback bg for empty img */}
              <img
                src={
                  product.images[currentImageIndex] ||
                  "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={product.name || "Product"}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  // ✅ Handle broken images
                  console.log("Image load error:", e);
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />
              {product.images && product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 bg-black/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full bg-white/80 hover:bg-white"
                    onClick={handlePrevImage}
                  >
                    ←
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full bg-white/80 hover:bg-white"
                    onClick={handleNextImage}
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name || "Product"} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/80x80?text=Img+${index + 1}";
                      }}
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
                  {product.category || "Uncategorized"}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.name || "Unnamed Product"} {/* ✅ Fallback */}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">
                  {product.price || "0.00"} Birr {/* ✅ Fallback & Birr */}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>
                  Sold by {product.seller?.name || "Unknown Seller"}
                </span>{" "}
                {/* ✅ Safe access */}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Posted on {formattedDate}</span>
              </div>
              {product.stock && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4">📦</span>
                  <span>{product.stock} in stock</span>
                </div>
              )}
              {product.rating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4">⭐</span>
                  <span>{product.rating} rating</span>
                </div>
              )}
              {product.paymentOptions && product.paymentOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="w-4 h-4">💳</span>
                    <span>Payment Options</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {product.paymentOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span>•</span>
                        <span>
                          {getPaymentMethodLabel(option.method)} -{" "}
                          {option.accountNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Button
                className="w-full h-12 text-lg"
                size="lg"
                variant={inCart ? "secondary" : "default"}
                onClick={handleToggleCart}
                disabled={adding}
              >
                {adding ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inCart ? "Remove from Cart" : "Add to Cart"}
                  </>
                )}
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
          animate="visible" // ✅ Force visible
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Description
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-card p-4 rounded-lg">
            {" "}
            {/* ✅ Fallback bg for visibility */}
            {product.description || "No description available."}
          </p>
        </motion.div>

        {/* Seller Contact Section */}
        <motion.div
          className="mt-12 border-t pt-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible" // ✅ Force visible
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
