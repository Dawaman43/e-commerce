import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Package,
  User,
  Truck,
  CheckCircle,
  XCircle,
  ChevronRight,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { easeOut } from "framer-motion";

type StatusKey = "pending" | "shipped" | "delivered" | "cancelled";

// Mock orders
const orders = [
  {
    id: "#ORD-001",
    date: "2025-10-12",
    status: "delivered" as StatusKey,
    items: [{ name: "Vintage Vinyl Record Player", qty: 1, price: "$150" }],
    total: "$150.00",
    seller: "jane_doe",
    tracking: "UPS123456789",
    slug: "ord-001",
  },
  {
    id: "#ORD-002",
    date: "2025-10-10",
    status: "shipped" as StatusKey,
    items: [{ name: "Wireless Gaming Headset", qty: 1, price: "$80" }],
    total: "$80.00",
    seller: "tech_guy88",
    tracking: "USPS987654321",
    slug: "ord-002",
  },
  {
    id: "#ORD-003",
    date: "2025-10-08",
    status: "pending" as StatusKey,
    items: [
      { name: "Handmade Ceramic Mug Set", qty: 1, price: "$25" },
      { name: "Leather Jacket (Size M)", qty: 1, price: "$100" },
    ],
    total: "$125.00",
    seller: "crafty_mom",
    tracking: null,
    slug: "ord-003",
  },
  {
    id: "#ORD-004",
    date: "2025-10-05",
    status: "cancelled" as StatusKey,
    items: [{ name: "Mountain Bike - Like New", qty: 1, price: "$300" }],
    total: "$300.00",
    seller: "bike_enthusiast",
    tracking: null,
    slug: "ord-004",
  },
  {
    id: "#ORD-005",
    date: "2025-10-03",
    status: "delivered" as StatusKey,
    items: [{ name: "Acoustic Guitar", qty: 1, price: "$200" }],
    total: "$200.00",
    seller: "music_lover",
    tracking: "FedEx456789012",
    slug: "ord-005",
  },
  {
    id: "#ORD-006",
    date: "2025-10-01",
    status: "shipped" as StatusKey,
    items: [{ name: "Trade: PS5 for Headset", qty: 1, price: "Trade" }],
    total: "Trade",
    seller: "fashionista22",
    tracking: null,
    slug: "ord-006",
  },
];

// Status icons and colors
const statusConfig: Record<
  StatusKey,
  { icon: React.ComponentType<any>; color: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  shipped: {
    icon: Truck,
    color: "bg-blue-100 text-blue-800",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-800",
    label: "Cancelled",
  },
};

// Mock filter categories (statuses)
const statusFilters = [
  { name: "Pending", value: "pending" },
  { name: "Shipped", value: "shipped" },
  { name: "Delivered", value: "delivered" },
  { name: "Cancelled", value: "cancelled" },
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

function OrdersPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatuses.size === 0 || selectedStatuses.has(order.status);
    return matchesSearch && matchesStatus;
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
              Your Orders
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              Track your purchases, trades, and deliveries all in one place.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by order ID or seller..."
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
              {filteredOrders.length} Orders
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="/listings">
                Continue Shopping
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Orders List */}
            <motion.div
              ref={ref}
              className="lg:col-span-3"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    No orders found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    const statusColor = statusConfig[order.status].color;
                    const statusLabel = statusConfig[order.status].label;
                    return (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        whileHover={shouldReduceMotion ? {} : hoverScale}
                      >
                        <a href={`/orders/${order.slug}`}>
                          <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                            <CardHeader className="p-6 pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    {order.id}
                                  </span>
                                  <Badge className={`${statusColor} px-2 py-1`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusLabel}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(order.date).toLocaleDateString()}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                      <Package className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Qty: {item.qty}
                                      </p>
                                    </div>
                                    <span className="font-semibold">
                                      {item.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="w-4 h-4" />
                                  <span>Sold by @{order.seller}</span>
                                </div>
                                <div className="text-lg font-bold text-primary">
                                  {order.total}
                                </div>
                              </div>
                              {order.tracking && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between"
                                  >
                                    Track Order
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
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
              {/* Status Filter */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {statusFilters.map((status) => (
                      <li key={status.value}>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={selectedStatuses.has(status.value)}
                              onCheckedChange={(checked: boolean) => {
                                const newSet = new Set(selectedStatuses);
                                if (checked) {
                                  newSet.add(status.value);
                                } else {
                                  newSet.delete(status.value);
                                }
                                setSelectedStatuses(newSet);
                              }}
                            />
                            <span className="text-sm">{status.name}</span>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Orders:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipped:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivered:</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cancelled:</span>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total Spent:</span>
                      <span>$855.00</span>
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
                      <a href="/listings">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href="/sell">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Sell an Item
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

export default OrdersPage;
