import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";
import {
  Package,
  Truck,
  User,
  MapPin,
  MessageCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Calendar,
} from "lucide-react";

// Types for safety
type OrderStatus = "pending" | "in-progress" | "awaiting-pickup";
type Order = {
  id: string;
  item: string;
  seller: string;
  status: OrderStatus;
  date: string;
  price: string;
  location: string;
  productId?: number; // Added optional productId for linking to product page
};

// Mock data - replace with API fetch (e.g., useQuery for active orders)
const mockOrders: Order[] = [
  {
    id: "#ORD-12345",
    item: "Vintage Vinyl Record Player",
    seller: "Alex Rivera",
    status: "pending",
    date: "Oct 10, 2025",
    price: "$150",
    location: "Brooklyn, NY",
    productId: 4, // Linked to product id
  },
  {
    id: "#ORD-12346",
    item: "Wireless Gaming Headset",
    seller: "Jordan Lee",
    status: "in-progress",
    date: "Oct 12, 2025",
    price: "Trade for PS5",
    location: "Manhattan, NY",
    productId: 5, // Linked to product id
  },
  {
    id: "#ORD-12347",
    item: "Handmade Ceramic Mug Set",
    seller: "Taylor Kim",
    status: "awaiting-pickup",
    date: "Oct 9, 2025",
    price: "$25",
    location: "Queens, NY",
    // No productId, so no link
  },
  {
    id: "#ORD-12348",
    item: "Mountain Bike - Like New",
    seller: "Casey Patel",
    status: "pending",
    date: "Oct 11, 2025",
    price: "$300",
    location: "Harlem, NY",
    // No productId, so no link
  },
  {
    id: "#ORD-12349",
    item: "Leather Jacket (Size M)",
    seller: "Riley Chen",
    status: "in-progress",
    date: "Oct 13, 2025",
    price: "Best Offer",
    location: "Bronx, NY",
    // No productId, so no link
  },
];

// Valid shadcn Badge variants only
type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: BadgeVariant }
> = {
  pending: { label: "Pending Payment", color: "default" },
  "in-progress": { label: "In Progress", color: "secondary" },
  "awaiting-pickup": { label: "Awaiting Pickup", color: "outline" },
} as const;

const getStatusInfo = (
  status: OrderStatus
): { label: string; color: BadgeVariant } => {
  return statusConfig[status];
};

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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

function ActiveOrders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const hasOrders = mockOrders.length > 0;

  // Filtered orders
  const filteredOrders: Order[] = mockOrders
    .filter(
      (order) =>
        order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.seller.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  // Mock refresh function
  const handleRefresh = () => {
    // Simulate API refresh
    console.log("Refreshing orders...");
  };

  // Check if order is today
  const isToday = (dateStr: string) => {
    const today = new Date("2025-10-13"); // Current date
    const orderDate = new Date(
      dateStr.replace(/(\w{3}) (\d{1,2}), (\d{4})/, "$3-$2 $1")
    );
    return orderDate.toDateString() === today.toDateString();
  };

  const ItemLink = ({
    children,
    productId,
  }: {
    children: React.ReactNode;
    productId?: number;
  }) => {
    if (!productId) {
      return <>{children}</>;
    }
    return (
      <Link
        to={`/product/${productId}`}
        className="hover:underline focus-visible:underline"
      >
        {children}
      </Link>
    );
  };

  return (
    <section
      ref={ref}
      className="relative py-8 md:py-12 bg-gradient-to-br from-background to-muted/20"
      aria-label="Your active orders"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
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
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Active Orders
            </h2>
            <p className="text-muted-foreground text-sm">
              Track your current buys, sells, and trades.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
              aria-label="Refresh orders"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2"
              asChild
            >
              <motion.a
                href="/dashboard/orders"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Eye className="w-4 h-4" />
                View All Orders
              </motion.a>
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by item or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="awaiting-pickup">Awaiting Pickup</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results Info */}
        {hasOrders && (
          <motion.p
            className="text-center text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Showing {filteredOrders.length} of {mockOrders.length} active orders
          </motion.p>
        )}

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <motion.div
              className="w-full"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Desktop Table */}
              <table className="hidden md:table w-full bg-card rounded-lg shadow-sm border border-border">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-semibold text-foreground">
                      Order
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Item
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Seller
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Date
                    </th>
                    <th className="text-left p-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      className="border-b border-border/20 hover:bg-muted/50 transition-colors"
                      variants={rowVariants}
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : { backgroundColor: "rgba(0,0,0,0.04)" }
                      }
                    >
                      <td className="p-4 font-mono text-sm text-muted-foreground">
                        {order.id}
                      </td>
                      <td className="p-4">
                        <ItemLink productId={order.productId}>
                          <div className="font-medium text-foreground">
                            {order.item}
                          </div>
                          <div className="text-sm text-primary font-semibold">
                            {order.price}
                          </div>
                        </ItemLink>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{order.seller}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={getStatusInfo(order.status).color}
                          className={`${
                            order.status === "pending" ? "animate-pulse" : ""
                          }`}
                        >
                          {getStatusInfo(order.status).label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {order.date}
                        {isToday(order.date) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Today
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Track order"
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Contact seller"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
                    variants={rowVariants}
                    whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {order.id}
                      </span>
                      <Badge variant={getStatusInfo(order.status).color}>
                        {getStatusInfo(order.status).label}
                      </Badge>
                    </div>
                    <ItemLink productId={order.productId}>
                      <h3 className="font-medium text-foreground mb-1">
                        {order.item}
                      </h3>
                      <p className="text-primary font-semibold mb-2">
                        {order.price}
                      </p>
                    </ItemLink>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{order.seller}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{order.date}</span>
                        {isToday(order.date) && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Today
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        aria-label="Track order"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Track
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 p-0"
                        aria-label="Contact seller"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No active orders yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by browsing new listings or posting your own.
            </p>
            <Button asChild>
              <motion.a
                href="/listings"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Browse Listings
              </motion.a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default ActiveOrders;
