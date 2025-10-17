import { useState, useEffect } from "react";
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
import { getOrders } from "@/api/order";
import type { Order, OrdersResponse, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User as UserType } from "@/types/user";
import { RefreshCw } from "lucide-react";

const getItemName = (order: Order): string => {
  if (typeof order.product === "string") return order.product;
  return (order.product as Product)?.name || "";
};

const getSellerName = (order: Order): string => {
  if (typeof order.seller === "string") return order.seller;
  return (order.seller as UserType)?.name || "";
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type StatusKey = OrderStatus;

const statusConfig: Record<
  StatusKey,
  { icon: React.ComponentType<any>; color: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  payment_sent: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "Payment Sent",
  },
  paid: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Paid",
  },
  shipped: {
    icon: Truck,
    color: "bg-blue-100 text-blue-800",
    label: "Shipped",
  },
  completed: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Completed",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-800",
    label: "Cancelled",
  },
};

const statusFilters = [
  { name: "Pending", value: "pending" as const },
  { name: "Payment Sent", value: "payment_sent" as const },
  { name: "Paid", value: "paid" as const },
  { name: "Shipped", value: "shipped" as const },
  { name: "Completed", value: "completed" as const },
  { name: "Cancelled", value: "cancelled" as const },
];

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Set<StatusKey>>(
    new Set()
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response: OrdersResponse = await getOrders();
        setOrders(response.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response: OrdersResponse = await getOrders();
      setOrders(response.orders || []);
    } catch (err) {
      console.error("Failed to refresh orders:", err);
      setError("Failed to refresh orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSellerName(order).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatuses.size === 0 || selectedStatuses.has(order.status);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const pendingCount = orders.filter(
    (o) => o.status === "pending" || o.status === "payment_sent"
  ).length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter(
    (o) => o.status === "paid" || o.status === "completed"
  ).length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const totalSpent = orders
    .filter((o) => o.status === "completed" || o.status === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center max-w-4xl mx-auto">
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
          </div>
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
            <div className="lg:col-span-3">
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
                    const item = {
                      name: getItemName(order),
                      qty: order.quantity,
                      price:
                        typeof order.product === "string"
                          ? `$${order.totalAmount / order.quantity}`
                          : (order.product as Product).price,
                    };
                    return (
                      <a key={order._id} href={`/orders/${order._id}`}>
                        <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors group cursor-pointer">
                          <CardHeader className="p-6 pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {order._id}
                                </span>
                                <Badge className={`${statusColor} px-2 py-1`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusLabel}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6 pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
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
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>Sold by @{getSellerName(order)}</span>
                              </div>
                              <div className="text-lg font-bold text-primary">
                                ${order.totalAmount.toFixed(2)}
                              </div>
                            </div>
                            {order.deliveryInfo?.trackingNumber && (
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 space-y-6">
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
                    <span className="font-semibold">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending:</span>
                    <span className="font-semibold">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipped:</span>
                    <span className="font-semibold">{shippedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivered:</span>
                    <span className="font-semibold">{deliveredCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cancelled:</span>
                    <span className="font-semibold">{cancelledCount}</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total Spent:</span>
                      <span>${totalSpent.toFixed(2)}</span>
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
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrdersPage;
