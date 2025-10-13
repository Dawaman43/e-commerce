import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, easeOut } from "framer-motion";
import { useRef } from "react";
import {
  Package,
  CheckCircle,
  RefreshCw,
  User,
  Calendar,
  MapPin,
  Star,
  MessageCircle,
  Eye,
} from "lucide-react";

// Types for safety
type OrderStatus = "completed" | "delivered" | "refunded" | "cancelled";
type Order = {
  id: string;
  item: string;
  seller: string;
  status: OrderStatus;
  date: string;
  price: string;
  location: string;
  rating?: number | null; // Optional for completed orders
};

// Mock data - replace with API fetch (e.g., useQuery for recent orders, sorted by date desc)
const mockOrders: Order[] = [
  {
    id: "#ORD-12344",
    item: "Acoustic Guitar",
    seller: "Morgan Santos",
    status: "completed",
    date: "Sep 30, 2025",
    price: "Trade for Amp",
    location: "Staten Island, NY",
    rating: 5,
  },
  {
    id: "#ORD-12343",
    item: "Jewelry & Accessories",
    seller: "Quinn Morales",
    status: "delivered",
    date: "Oct 5, 2025",
    price: "$50",
    location: "Lower East Side, NY",
    rating: null,
  },
  {
    id: "#ORD-12342",
    item: "Tech Accessories",
    seller: "Drew Nguyen",
    status: "completed",
    date: "Sep 25, 2025",
    price: "$75",
    location: "Upper East Side, NY",
    rating: 4.5,
  },
  {
    id: "#ORD-12341",
    item: "Home Decor",
    seller: "Casey Patel",
    status: "refunded",
    date: "Oct 8, 2025",
    price: "$120",
    location: "Harlem, NY",
    rating: null,
  },
  {
    id: "#ORD-12340",
    item: "Books & Collectibles",
    seller: "Riley Chen",
    status: "delivered",
    date: "Oct 10, 2025",
    price: "$20",
    location: "Bronx, NY",
    rating: null,
  },
];

// Valid shadcn Badge variants only
type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: BadgeVariant }
> = {
  completed: { label: "Completed", color: "default" },
  delivered: { label: "Delivered", color: "secondary" },
  refunded: { label: "Refunded", color: "outline" },
  cancelled: { label: "Cancelled", color: "destructive" },
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

function RecentOrders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Reduced motion check
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hasOrders = mockOrders.length > 0;

  return (
    <section
      ref={ref}
      className="relative py-8 md:py-12 bg-background"
      aria-label="Your recent orders"
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Recent Orders
            </h2>
            <p className="text-muted-foreground text-sm">
              A look back at your completed trades and purchases.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2"
            asChild
          >
            <motion.a
              href="/dashboard/orders/history"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Eye className="w-4 h-4" />
              View Order History
            </motion.a>
          </Button>
        </motion.div>

        {hasOrders ? (
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
                  {mockOrders.map((order) => (
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
                        <div className="font-medium text-foreground">
                          {order.item}
                        </div>
                        <div className="text-sm text-primary font-semibold">
                          {order.price}
                        </div>
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
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {getStatusInfo(order.status).label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {order.rating ? (
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{order.rating}</span>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              aria-label="Leave review"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Reopen order"
                          >
                            <RefreshCw className="w-4 h-4" />
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
                {mockOrders.map((order) => (
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
                    <h3 className="font-medium text-foreground mb-1">
                      {order.item}
                    </h3>
                    <p className="text-primary font-semibold mb-2">
                      {order.price}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{order.seller}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{order.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {order.rating ? (
                        <div className="flex items-center gap-1 text-sm text-yellow-600 flex-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{order.rating}</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          aria-label="Leave review"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      )}
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
              No recent orders
            </h3>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here once you've completed some
              trades.
            </p>
            <Button asChild>
              <motion.a
                href="/listings"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Start Browsing
              </motion.a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default RecentOrders;
