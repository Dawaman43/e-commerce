import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  User,
  ShoppingBag,
  ArrowRightLeft,
  CreditCard,
  Headphones,
  Mail,
  Phone,
  MapPin,
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
import { easeOut } from "framer-motion";

// Mock help articles
const helpArticles = [
  {
    id: 1,
    title: "How to Create and Verify Your Account",
    excerpt:
      "Step-by-step guide to signing up, verifying your email, and setting up your profile for secure trading.",
    category: "Account",
    date: "2025-10-10",
    readTime: "2 min",
    image: "/assets/help1.jpg",
    slug: "create-account",
  },
  {
    id: 2,
    title: "Browsing and Buying Items Locally",
    excerpt:
      "Tips for searching listings, contacting sellers, and completing purchases safely in your neighborhood.",
    category: "Buying",
    date: "2025-10-05",
    readTime: "3 min",
    image: "/assets/help2.jpg",
    slug: "browsing-buying",
  },
  {
    id: 3,
    title: "Listing Your Items for Sale or Trade",
    excerpt:
      "Everything you need to know about creating compelling listings with photos, descriptions, and pricing.",
    category: "Selling",
    date: "2025-09-28",
    readTime: "4 min",
    image: "/assets/help3.jpg",
    slug: "listing-items",
  },
  {
    id: 4,
    title: "Proposing and Accepting Trades",
    excerpt:
      "Learn how to suggest trades, negotiate terms, and finalize exchanges with other users.",
    category: "Trading",
    date: "2025-09-20",
    readTime: "3 min",
    image: "/assets/help4.jpg",
    slug: "proposing-trades",
  },
  {
    id: 5,
    title: "Payment Methods and Security",
    excerpt:
      "Accepted payment options, how to protect your transactions, and what to do if there's an issue.",
    category: "Payments",
    date: "2025-09-15",
    readTime: "2 min",
    image: "/assets/help5.jpg",
    slug: "payments-security",
  },
  {
    id: 6,
    title: "Reporting Issues and Disputes",
    excerpt:
      "How to report problematic listings, users, or transactions, and our resolution process.",
    category: "Support",
    date: "2025-09-10",
    readTime: "5 min",
    image: "/assets/help6.jpg",
    slug: "reporting-disputes",
  },
];

// Mock categories
const categories = [
  { name: "Account", count: 8, slug: "account", icon: User },
  { name: "Buying", count: 12, slug: "buying", icon: ShoppingBag },
  { name: "Selling", count: 10, slug: "selling", icon: ShoppingBag },
  { name: "Trading", count: 6, slug: "trading", icon: ArrowRightLeft },
  { name: "Payments", count: 5, slug: "payments", icon: CreditCard },
  { name: "Support", count: 15, slug: "support", icon: Headphones },
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

function HelpPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");

  // Filter articles based on search term
  const filteredArticles = helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Find answers to common questions, guides, and support resources to
              get the most out of Gebeya Go.
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  className="pl-10 pr-4"
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Articles Grid */}
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
                    : "Popular Articles"}
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
                    <a href="/help/all">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No articles found for "{searchTerm}". Try a different search
                    term or browse categories.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(0, 6).map((article) => (
                    <motion.div
                      key={article.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                    >
                      <a href={`/help/${article.slug}`}>
                        <Card className="h-full overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                          <div className="relative h-48 bg-muted overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <Badge className="absolute top-2 left-2">
                              {article.category}
                            </Badge>
                          </div>
                          <CardContent className="p-6">
                            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </CardTitle>
                            <CardDescription className="mb-4 line-clamp-3">
                              {article.excerpt}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(
                                      article.date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{article.readTime}</span>
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
              {/* Quick Categories */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <li key={category.slug}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-auto p-2 text-left hover:bg-muted/50"
                              asChild
                            >
                              <a href={`/help/categories/${category.slug}`}>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {category.count}
                                  </span>
                                </div>
                              </a>
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Support */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Headphones className="w-5 h-5" />
                      Need More Help?
                    </CardTitle>
                    <CardDescription>
                      Can't find what you're looking for? Contact our support
                      team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="mailto:support@gebayago.com">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Support
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="tel:+15551234567">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Us
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our team is ready to assist you with any issues or inquiries about
              using Gebeya Go.
            </p>
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90"
              asChild
            >
              <motion.a
                href="mailto:support@gebayago.com?subject=Help%20Request"
                whileHover={shouldReduceMotion ? {} : hoverScale}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                Get Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
            </Button>
            {/* Contact Info */}
            <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@gebayago.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HelpPage;
