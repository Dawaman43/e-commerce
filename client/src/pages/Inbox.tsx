import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Clock,
  Calendar,
  User,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  XCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock messages/conversations
const conversations = [
  {
    id: 1,
    sender: "Jane Doe",
    avatar: "/assets/seller1.jpg",
    preview:
      "Hi! Is the vinyl player still available? I'd love to pick it up tomorrow.",
    time: "2025-10-13 14:30",
    unread: true,
    messages: 3,
    slug: "jane-doe-convo",
  },
  {
    id: 2,
    sender: "Tech Guy",
    avatar: "/assets/seller2.jpg",
    preview:
      "Thanks for the quick response! Let's schedule the trade for Saturday.",
    time: "2025-10-13 12:15",
    unread: false,
    messages: 1,
    slug: "tech-guy-convo",
  },
  {
    id: 3,
    sender: "Crafty Mom",
    avatar: "/assets/seller3.jpg",
    preview: "The mug set looks perfect! Can you hold it until next week?",
    time: "2025-10-12 18:45",
    unread: true,
    messages: 2,
    slug: "crafty-mom-convo",
  },
  {
    id: 4,
    sender: "Bike Enthusiast",
    avatar: "/assets/seller4.jpg",
    preview: "Payment sent! Looking forward to the bike.",
    time: "2025-10-12 10:20",
    unread: false,
    messages: 1,
    slug: "bike-enthusiast-convo",
  },
  {
    id: 5,
    sender: "Fashionista",
    avatar: "/assets/seller5.jpg",
    preview: "Sorry, I sold it already. Check out my other listings!",
    time: "2025-10-11 16:05",
    unread: false,
    messages: 4,
    slug: "fashionista-convo",
  },
  {
    id: 6,
    sender: "Music Lover",
    avatar: "/assets/seller6.jpg",
    preview: "Great trade! Thanks for the amp. 🎸",
    time: "2025-10-11 09:30",
    unread: true,
    messages: 1,
    slug: "music-lover-convo",
  },
];

// Mock filter options
const filterOptions = [
  { name: "All", value: "all" },
  { name: "Unread", value: "unread" },
  { name: "Read", value: "read" },
  { name: "Trades", value: "trades" },
  { name: "Sales", value: "sales" },
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

function InboxPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unread" && conv.unread) ||
      (selectedFilter === "read" && !conv.unread) ||
      (selectedFilter === "trades" && conv.preview.includes("trade")) ||
      (selectedFilter === "sales" && !conv.preview.includes("trade"));
    return matchesSearch && matchesFilter;
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
              Your Inbox
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Stay connected with buyers and sellers in your community.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages or contacts..."
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
              {filteredConversations.length} Conversations
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/compose">
                New Message
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Conversations List */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No messages found. Try adjusting your search or filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      variants={itemVariants}
                      whileHover={shouldReduceMotion ? {} : hoverScale}
                    >
                      <a href={`/inbox/${conv.slug}`}>
                        <Card
                          className={`overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer ${
                            conv.unread ? "bg-muted/50" : ""
                          }`}
                        >
                          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={conv.avatar} />
                              <AvatarFallback>
                                {conv.sender.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                  {conv.sender}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(conv.time).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </span>
                                </div>
                              </div>
                              <CardDescription className="text-sm text-muted-foreground truncate mb-2">
                                {conv.preview}
                              </CardDescription>
                              {conv.unread && (
                                <Badge variant="secondary" className="text-xs">
                                  {conv.messages} new
                                </Badge>
                              )}
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
              {/* Filter Select */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5" />
                    Filter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Messages" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Inbox Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Messages:</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unread:</span>
                    <span className="font-semibold text-primary">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Conversations:</span>
                    <span className="font-semibold">6</span>
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
                      <a href="/compose">
                        <Mail className="w-4 h-4 mr-2" />
                        New Message
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/settings">
                        <User className="w-4 h-4 mr-2" />
                        Account Settings
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

export default InboxPage;
