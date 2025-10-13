import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Calendar,
  User,
  Clock,
  Tag,
  Search,
  ArrowRight,
  ChevronRight,
  Mail,
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
import { easeOut } from "framer-motion";

// Mock blog posts
const blogPosts = [
  {
    id: 1,
    title: "The Rise of Local Trading in Urban Communities",
    excerpt:
      "Explore how peer-to-peer marketplaces are transforming neighborhoods and fostering sustainable living in cities like New York.",
    date: "2025-10-01",
    readTime: "5 min",
    author: "Aisha Johnson",
    image: "/assets/blog1.jpg",
    tags: ["Community", "Sustainability", "NYC"],
    slug: "rise-local-trading",
  },
  {
    id: 2,
    title: "Top Tips for Successful Item Trades",
    excerpt:
      "Learn essential strategies to make your trades smooth, fair, and mutually beneficial in the local marketplace.",
    date: "2025-09-25",
    readTime: "4 min",
    author: "Raj Patel",
    image: "/assets/blog2.jpg",
    tags: ["Trading", "Tips", "Beginner"],
    slug: "tips-successful-trades",
  },
  {
    id: 3,
    title: "Sustainable Fashion: Buying Second-Hand in the Big Apple",
    excerpt:
      "A guide to finding unique, eco-friendly fashion pieces through local sellers and reducing your carbon footprint.",
    date: "2025-09-18",
    readTime: "6 min",
    author: "Elena Vasquez",
    image: "/assets/blog3.jpg",
    tags: ["Fashion", "Eco", "Shopping"],
    slug: "sustainable-fashion-nyc",
  },
  {
    id: 4,
    title: "How Gebeya Go is Empowering Small Businesses",
    excerpt:
      "Stories from local entrepreneurs who use our platform to reach more customers and grow their ventures.",
    date: "2025-09-10",
    readTime: "7 min",
    author: "Marcus Lee",
    image: "/assets/blog4.jpg",
    tags: ["Business", "Growth", "Stories"],
    slug: "empowering-small-businesses",
  },
  {
    id: 5,
    title: "Beginner's Guide to Listing Your First Item",
    excerpt:
      "Step-by-step instructions to get your item online quickly and attract the right buyers in your area.",
    date: "2025-09-05",
    readTime: "3 min",
    author: "Aisha Johnson",
    image: "/assets/blog5.jpg",
    tags: ["Guide", "Selling", "Beginner"],
    slug: "listing-first-item",
  },
  {
    id: 6,
    title: "The Future of Local Commerce Post-2025",
    excerpt:
      "Predictions and trends on how technology will shape neighborhood economies in the coming years.",
    date: "2025-08-28",
    readTime: "8 min",
    author: "Raj Patel",
    image: "/assets/blog6.jpg",
    tags: ["Future", "Trends", "Tech"],
    slug: "future-local-commerce",
  },
];

// Mock categories
const categories = [
  { name: "Community", count: 12, slug: "community" },
  { name: "Trading", count: 8, slug: "trading" },
  { name: "Selling", count: 15, slug: "selling" },
  { name: "Sustainability", count: 10, slug: "sustainability" },
  { name: "NYC Life", count: 7, slug: "nyc-life" },
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

function BlogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
              Gebeya Go Blog
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Insights, tips, and stories from the heart of local commerce.
              Discover how to buy, sell, and trade smarter in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <motion.a
                  href="/listings"
                  whileHover={shouldReduceMotion ? {} : hoverScale}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                >
                  Browse Listings
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
                asChild
              >
                <a href="/sell">Start Selling</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts Grid */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold">
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "Latest Posts"}
                </h2>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
                {!searchTerm && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/blog/categories">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No posts found for "{searchTerm}". Try a different search
                    term.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.slice(0, 6).map((post) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                    >
                      <a href={`/blog/${post.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <CardContent className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="mb-4 line-clamp-3">
                              {post.excerpt}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(post.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.readTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{post.author}</span>
                                </div>
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

            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-1 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Search */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search articles..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Categories */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {categories.map((category) => (
                        <li key={category.slug}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-left hover:bg-muted/50"
                            asChild
                          >
                            <a href={`/blog/categories/${category.slug}`}>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <Tag className="w-4 h-4" />
                                  {category.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {category.count}
                                </span>
                              </div>
                            </a>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Newsletter */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Newsletter
                    </CardTitle>
                    <CardDescription>
                      Stay updated with the latest from our blog.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-2">
                      <Input placeholder="Enter your email" />
                      <Button type="submit" className="w-full rounded-xl">
                        Subscribe
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
