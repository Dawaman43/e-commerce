import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  Filter,
  Bell,
  Clock,
  Calendar,
  CheckCircle,
  MessageCircle,
  Package,
  Star,
  ArrowRight,
  ChevronRight,
  User,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { easeOut } from "framer-motion";

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "Order #ORD-001 Delivered",
    description: "Your vintage vinyl player has arrived. Enjoy!",
    date: "2025-10-13",
    time: "14:30",
    type: "order",
    read: false,
    icon: Package,
    slug: "ord-001-delivered",
  },
  {
    id: 2,
    title: "New Message from Jane Doe",
    description:
      "Hi! Is the vinyl player still available? I'd love to pick it up tomorrow.",
    date: "2025-10-13",
    time: "12:15",
    type: "message",
    read: true,
    icon: MessageCircle,
    slug: "jane-doe-message",
  },
  {
    id: 3,
    title: "You Earned a 5-Star Review",
    description: "Great transaction! Thanks for the quick delivery.",
    date: "2025-10-12",
    time: "18:45",
    type: "review",
    read: false,
    icon: Star,
    slug: "5-star-review",
  },
  {
    id: 4,
    title: "Trade Proposal Accepted",
    description:
      "Your offer for the guitar amp has been accepted. Schedule a meetup.",
    date: "2025-10-12",
    time: "10:20",
    type: "trade",
    read: true,
    icon: ArrowRight,
    slug: "trade-accepted",
  },
  {
    id: 5,
    title: "Payment Received for Mug Set",
    description: "Funds from Crafty Mom have been deposited to your account.",
    date: "2025-10-11",
    time: "16:05",
    type: "payment",
    read: false,
    icon: CheckCircle,
    slug: "payment-mug-set",
  },
  {
    id: 6,
    title: "New Follower: Music Lover",
    description: "Music Lover is now following your listings.",
    date: "2025-10-11",
    time: "09:30",
    type: "follow",
    read: true,
    icon: User,
    slug: "new-follower",
  },
];

// Mock filter options
const filterOptions = [
  { name: "All", value: "all" },
  { name: "Unread", value: "unread" },
  { name: "Orders", value: "order" },
  { name: "Messages", value: "message" },
  { name: "Reviews", value: "review" },
  { name: "Trades", value: "trade" },
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

function NotificationsPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unread" && !notif.read) ||
      selectedFilter === notif.type;
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
              Notifications
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Stay updated with the latest activity on your account.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
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
              {filteredNotifications.length} Notifications
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/settings">
                Settings
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Notifications List */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No notifications found. Try adjusting your search or filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        variants={itemVariants}
                        whileHover={shouldReduceMotion ? {} : hoverScale}
                      >
                        <a href={`/notifications/${notif.slug}`}>
                          <Card
                            className={`overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer ${
                              !notif.read ? "bg-muted/50" : ""
                            }`}
                          >
                            <CardContent className="p-6 flex items-start gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  notif.read ? "bg-muted" : "bg-primary/10"
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${
                                    notif.read
                                      ? "text-muted-foreground"
                                      : "text-primary"
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {notif.title}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(
                                        `${notif.date}T${notif.time}`
                                      ).toLocaleString([], {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {notif.description}
                                </CardDescription>
                                {!notif.read && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    New
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </motion.div>
                    );
                  })}
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
                      <SelectValue placeholder="All Notifications" />
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
                  <CardTitle className="text-lg">
                    Notification Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-semibold">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unread:</span>
                    <span className="font-semibold text-primary">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Orders:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Messages:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Reviews:</span>
                    <span className="font-semibold">1</span>
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
                      <a href="/inbox">
                        <Mail className="w-4 h-4 mr-2" />
                        View Inbox
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/settings">
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Settings
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

export default NotificationsPage;
