import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  User,
  Star,
  MapPin,
  ShoppingBag,
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
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
import { Checkbox } from "@/components/ui/checkbox";
import { easeOut } from "framer-motion";

// Mock sellers
const sellers = [
  {
    id: 1,
    name: "Jane Doe",
    avatar: "/assets/seller1.jpg",
    rating: 4.9,
    sales: 150,
    location: "Brooklyn, NY",
    bio: "Passionate collector of vintage electronics and records.",
    category: "Electronics",
    joined: "2024-01-15",
    slug: "jane-doe",
  },
  {
    id: 2,
    name: "Tech Guy",
    avatar: "/assets/seller2.jpg",
    rating: 4.7,
    sales: 89,
    location: "Manhattan, NY",
    bio: "Gamer and tech enthusiast selling gadgets and accessories.",
    category: "Electronics",
    joined: "2024-03-20",
    slug: "tech-guy",
  },
  {
    id: 3,
    name: "Crafty Mom",
    avatar: "/assets/seller3.jpg",
    bio: "Handmade crafts and home decor from a mom's creative corner.",
    rating: 5.0,
    sales: 45,
    location: "Queens, NY",
    category: "Home & Garden",
    joined: "2024-05-10",
    slug: "crafty-mom",
  },
  {
    id: 4,
    name: "Bike Enthusiast",
    avatar: "/assets/seller4.jpg",
    rating: 4.8,
    sales: 67,
    location: "Harlem, NY",
    bio: "Outdoor gear and bikes for adventure seekers.",
    category: "Sports",
    joined: "2024-02-05",
    slug: "bike-enthusiast",
  },
  {
    id: 5,
    name: "Fashionista",
    avatar: "/assets/seller5.jpg",
    rating: 4.6,
    sales: 120,
    location: "Bronx, NY",
    bio: "Curated second-hand fashion with style and sustainability.",
    category: "Fashion",
    joined: "2024-04-12",
    slug: "fashionista",
  },
  {
    id: 6,
    name: "Music Lover",
    avatar: "/assets/seller6.jpg",
    rating: 4.9,
    sales: 34,
    location: "Staten Island, NY",
    bio: "Instruments and music gear for fellow artists.",
    category: "Musical Instruments",
    joined: "2024-06-18",
    slug: "music-lover",
  },
];

// Mock categories for filter
const categoriesFilter = [
  { name: "Electronics", count: 12, slug: "electronics" },
  { name: "Home & Garden", count: 8, slug: "home-garden" },
  { name: "Fashion", count: 15, slug: "fashion" },
  { name: "Sports", count: 6, slug: "sports" },
  { name: "Musical Instruments", count: 4, slug: "music" },
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

function SellersPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  // Filter sellers based on search and categories
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.size === 0 || selectedCategories.has(seller.category);
    return matchesSearch && matchesCategory;
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
              Top Sellers
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Discover trusted local sellers in your community. Browse profiles
              and connect directly.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sellers by name, location, or category..."
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
              {filteredSellers.length} Sellers Found
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/sell">
                Become a Seller
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sellers Grid */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredSellers.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No sellers found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSellers.map((seller) => (
                    <motion.div
                      key={seller.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                    >
                      <a href={`/sellers/${seller.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <img
                              src={seller.avatar}
                              alt={seller.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <Badge className="absolute top-2 right-2">
                              {seller.category}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={seller.avatar}
                                alt={seller.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                  {seller.name}
                                </CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                                  <span>{seller.rating}</span>
                                  <span>• {seller.sales} sales</span>
                                </div>
                              </div>
                            </div>
                            <CardDescription className="line-clamp-3 mb-4">
                              {seller.bio}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{seller.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Member since{" "}
                                  {new Date(seller.joined).getFullYear()}
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
                        Start Selling
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

export default SellersPage;
