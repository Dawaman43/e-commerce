import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  Filter,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  Tag,
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

// Mock categories
const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Gadgets, devices, and tech accessories for modern living.",
    count: 250,
    icon: "📱",
    featuredItems: ["iPhone 14", "Wireless Headphones", "Smart Watch"],
    slug: "electronics",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, shoes, and accessories to refresh your style.",
    count: 320,
    icon: "👕",
    featuredItems: ["Leather Jacket", "Designer Sneakers", "Vintage Dress"],
    slug: "fashion",
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Furniture, decor, and tools to enhance your space.",
    count: 180,
    icon: "🏠",
    featuredItems: ["Ceramic Mug Set", "Garden Tools", "Wall Art"],
    slug: "home-garden",
  },
  {
    id: 4,
    name: "Sports",
    description: "Gear and equipment for active lifestyles.",
    count: 140,
    icon: "🚴",
    featuredItems: ["Mountain Bike", "Yoga Mat", "Running Shoes"],
    slug: "sports",
  },
  {
    id: 5,
    name: "Books",
    description: "New and used books for every reader.",
    count: 90,
    icon: "📚",
    featuredItems: ["Fiction Bestseller", "Cookbook", "Self-Help"],
    slug: "books",
  },
  {
    id: 6,
    name: "Musical Instruments",
    description: "Instruments and music gear for creators.",
    count: 60,
    icon: "🎸",
    featuredItems: ["Acoustic Guitar", "Keyboard", "Drum Set"],
    slug: "music",
  },
];

// Mock filter categories (sub-categories or tags)
const filterTags = [
  { name: "New", count: 450, slug: "new" },
  { name: "Used", count: 380, slug: "used" },
  { name: "Vintage", count: 120, slug: "vintage" },
  { name: "Local Pickup", count: 600, slug: "local" },
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

function CategoriesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());

  // Filter categories based on search and tags
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTags.size === 0 ||
      selectedTags.has("new") ||
      selectedTags.has("used") ||
      selectedTags.has("vintage");
    return matchesSearch && matchesTag;
  });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-4 md:mb-6">
              Explore Categories
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6 md:mb-8 px-4">
              Find what you're looking for in our curated collection of local
              listings.
            </p>
            <div className="max-w-md sm:max-w-2xl mx-auto w-full">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories or items..."
                  className="pl-10 sm:pl-12 pr-4 py-3 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              {filteredCategories.length} Categories
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="w-full lg:w-auto"
              asChild
            >
              <a
                href="/sell"
                className="justify-between w-full lg:justify-start"
              >
                Sell in a Category
                <ChevronRight className="w-4 h-4 ml-1 hidden lg:inline" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
            {/* Categories Grid */}
            <motion.div
              ref={ref}
              className="lg:col-span-3 order-2 lg:order-1"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No categories found. Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                      className="w-full"
                    >
                      <a href={`/categories/${category.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer w-full">
                          <div className="relative h-32 sm:h-48 bg-gradient-to-br from-muted to-muted-foreground/10 overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute top-4 left-4 text-3xl sm:text-4xl">
                              {category.icon}
                            </div>
                          </div>
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                              <CardTitle className="text-base sm:text-xl group-hover:text-primary transition-colors line-clamp-1">
                                {category.name}
                              </CardTitle>
                              <Badge variant="secondary" className="w-fit">
                                {category.count} items
                              </Badge>
                            </div>
                            <CardDescription className="mb-4 line-clamp-2 text-sm">
                              {category.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {category.featuredItems
                                .slice(0, 3)
                                .map((item, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                              <span>Explore Now</span>
                              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
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
              className="lg:col-span-1 order-1 lg:order-2 space-y-4 lg:space-y-6 w-full lg:w-auto"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Tags Filter */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ul className="space-y-2">
                    {filterTags.map((tag) => (
                      <li key={tag.slug}>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <Checkbox
                              className="w-4 h-4"
                              checked={selectedTags.has(tag.name)}
                              onCheckedChange={(checked: boolean) => {
                                const newSet = new Set(selectedTags);
                                if (checked) {
                                  newSet.add(tag.name);
                                } else {
                                  newSet.delete(tag.name);
                                }
                                setSelectedTags(newSet);
                              }}
                            />
                            <span>{tag.name}</span>
                          </label>
                          <span className="text-xs text-muted-foreground">
                            ({tag.count})
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      asChild
                    >
                      <a href="/sell">
                        <Tag className="w-4 h-4 mr-2" />
                        Sell an Item
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
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

export default CategoriesPage;
