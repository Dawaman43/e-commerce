import { Button } from "@/components/ui/button";
import { easeOut, motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react"; // Assuming you have Lucide icons installed

// Mock data - replace with your API fetch
const mockProducts = [
  {
    id: 1,
    image: "/assets/product1.jpg",
    title: "Vintage Vinyl Record Player",
    price: "$150",
    type: "sell",
    location: "Brooklyn, NY",
    seller: "jane_doe",
  },
  {
    id: 2,
    image: "/assets/product2.jpg",
    title: "Wireless Gaming Headset",
    price: "Trade for PS5",
    type: "trade",
    location: "Manhattan, NY",
    seller: "tech_guy88",
  },
  {
    id: 3,
    image: "/assets/product3.jpg",
    title: "Handmade Ceramic Mug Set",
    price: "$25",
    type: "sell",
    location: "Queens, NY",
    seller: "crafty_mom",
  },
  {
    id: 4,
    image: "/assets/product4.jpg",
    title: "Mountain Bike - Like New",
    price: "$300",
    type: "sell",
    location: "Harlem, NY",
    seller: "bike_enthusiast",
  },
  {
    id: 5,
    image: "/assets/product5.jpg",
    title: "Leather Jacket (Size M)",
    price: "Best Offer",
    type: "sell",
    location: "Bronx, NY",
    seller: "fashionista22",
  },
  {
    id: 6,
    image: "/assets/product6.jpg",
    title: "Acoustic Guitar",
    price: "Trade for Amp",
    type: "trade",
    location: "Staten Island, NY",
    seller: "music_lover",
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

function NewProduct() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 bg-background/50"
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fresh Finds Near You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the latest listings from local sellers. Something catch
            your eye?
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {mockProducts.map((product) => (
            <motion.article
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border"
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
                <span className="absolute top-2 right-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                  {product.type.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-2xl font-bold text-primary mb-1">
                  {product.price}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {product.location} • @{product.seller}
                </p>
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
              Browse All New Listings
            </motion.a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default NewProduct;
