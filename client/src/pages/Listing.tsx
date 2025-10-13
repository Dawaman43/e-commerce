import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Tag,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  User,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { easeOut } from "framer-motion";

// Mock listings
const listings = [
  {
    id: 1,
    title: "Vintage Vinyl Record Player",
    price: "$150",
    type: "sell",
    location: "Brooklyn, NY",
    seller: "jane_doe",
    image: "/assets/product1.jpg",
    category: "Electronics",
    date: "2025-10-12",
    readTime: "N/A",
    slug: "vintage-vinyl-player",
  },
  {
    id: 2,
    title: "Wireless Gaming Headset",
    price: "Trade for PS5",
    type: "trade",
    location: "Manhattan, NY",
    seller: "tech_guy88",
    image: "/assets/product2.jpg",
    category: "Electronics",
    date: "2025-10-11",
    readTime: "N/A",
    slug: "gaming-headset",
  },
  {
    id: 3,
    title: "Handmade Ceramic Mug Set",
    price: "$25",
    type: "sell",
    location: "Queens, NY",
    seller: "crafty_mom",
    image: "/assets/product3.jpg",
    category: "Home & Garden",
    date: "2025-10-10",
    readTime: "N/A",
    slug: "ceramic-mug-set",
  },
  {
    id: 4,
    title: "Mountain Bike - Like New",
    price: "$300",
    type: "sell",
    location: "Harlem, NY",
    seller: "bike_enthusiast",
    image: "/assets/product4.jpg",
    category: "Sports",
    date: "2025-10-09",
    readTime: "N/A",
    slug: "mountain-bike",
  },
  {
    id: 5,
    title: "Leather Jacket (Size M)",
    price: "Best Offer",
    type: "sell",
    location: "Bronx, NY",
    seller: "fashionista22",
    image: "/assets/product5.jpg",
    category: "Fashion",
    date: "2025-10-08",
    readTime: "N/A",
    slug: "leather-jacket",
  },
  {
    id: 6,
    title: "Acoustic Guitar",
    price: "Trade for Amp",
    type: "trade",
    location: "Staten Island, NY",
    seller: "music_lover",
    image: "/assets/product6.jpg",
    category: "Musical Instruments",
    date: "2025-10-07",
    readTime: "N/A",
    slug: "acoustic-guitar",
  },
];

// Mock categories for filter
const categoriesFilter = [
  { name: "Electronics", count: 20, slug: "electronics" },
  { name: "Home & Garden", count: 15, slug: "home-garden" },
  { name: "Fashion", count: 25, slug: "fashion" },
  { name: "Sports", count: 10, slug: "sports" },
  { name: "Musical Instruments", count: 8, slug: "music" },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const hoverScale = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

function ListingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Filter listings based on search, categories, and price
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.size === 0 || selectedCategories.has(listing.category);
    const matchesPrice =
      parseFloat(listing.price.replace(/[^0-9.]/g, "")) >= priceRange[0] &&
      parseFloat(listing.price.replace(/[^0-9.]/g, "")) <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6">
              Browse Listings
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Discover amazing deals and trades from local sellers in your
              community.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search listings, categories, or locations..."
                  className="pl-12 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {filteredListings.length} Results
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/sell">
                Sell Your Item
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Listings Grid */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No listings found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                    >
                      <a href={`/listing/${listing.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <Badge className="absolute top-2 right-2">
                              {listing.type.toUpperCase()}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Tag className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {listing.category}
                              </span>
                            </div>
                            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {listing.title}
                            </CardTitle>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-primary">
                                {listing.price}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{listing.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>@{listing.seller}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(listing.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sidebar Filters */}
            <motion.aside
              className="lg:col-span-1 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Categories Filter */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categoriesFilter.map((category) => (
                      <li key={category.slug}>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedCategories.has(category.name)}
                              onCheckedChange={(checked: boolean) => {
                                const newSet = new Set(selectedCategories);
                                if (checked) {
                                  newSet.add(category.name);
                                } else {
                                  newSet.delete(category.name);
                                }
                                setSelectedCategories(newSet);
                              }}
                            />
                            <span className="text-sm">{category.name}</span>
                          </label>
                          <span className="text-xs text-muted-foreground">
                            ({category.count})
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Price Range Filter */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5" />
                    Price Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/sell">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Sell an Item
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/trade">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Propose a Trade
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ListingPage;
