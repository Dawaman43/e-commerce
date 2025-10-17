import { useState, useEffect } from "react";
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
import {
  Package,
  Truck,
  User,
  MessageCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { getOrders } from "@/api/order";
import type { Order, OrdersResponse, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User as UserType } from "@/types/user";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: BadgeVariant }
> = {
  pending: { label: "Pending", color: "default" },
  payment_sent: { label: "Payment Sent", color: "secondary" },
  paid: { label: "Paid", color: "outline" },
  shipped: { label: "Shipped", color: "secondary" },
  completed: { label: "Completed", color: "default" },
  cancelled: { label: "Cancelled", color: "destructive" },
} as const;

const getStatusInfo = (
  status: OrderStatus
): { label: string; color: BadgeVariant } => {
  return statusConfig[status];
};

const getItemName = (order: Order): string => {
  if (typeof order.product === "string") return order.product;
  return (order.product as Product)?.name || "";
};

const getSellerName = (order: Order): string => {
  if (typeof order.seller === "string") return order.seller;
  return (order.seller as UserType)?.name || "";
};

const getProductId = (order: Order): string => {
  if (typeof order.product === "string") return order.product;
  return (order.product as Product)?._id || "";
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function ActiveOrders() {
  // State for orders and loading
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response: OrdersResponse = await getOrders();
        // Filter for active orders only
        const activeStatuses: OrderStatus[] = [
          "pending",
          "payment_sent",
          "paid",
          "shipped",
        ];
        const activeOrders = (response.orders || []).filter((order) =>
          activeStatuses.includes(order.status)
        );
        setOrders(activeOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRefresh = () => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response: OrdersResponse = await getOrders();
        // Filter for active orders only
        const activeStatuses: OrderStatus[] = [
          "pending",
          "payment_sent",
          "paid",
          "shipped",
        ];
        const activeOrders = (response.orders || []).filter((order) =>
          activeStatuses.includes(order.status)
        );
        setOrders(activeOrders);
      } catch (err) {
        console.error("Failed to refresh orders:", err);
        setError("Failed to refresh orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  const hasOrders = orders.length > 0;

  // Filtered orders
  const filteredOrders: Order[] = orders
    .filter(
      (order) =>
        getItemName(order).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSellerName(order).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    ); // Sort by date descending

  // Check if order is today
  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date("2025-10-17"); // Current date
    const orderDate = new Date(dateStr);
    return orderDate.toDateString() === today.toDateString();
  };

  const ItemLink = ({
    children,
    productId,
  }: {
    children: React.ReactNode;
    productId?: string;
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

  if (loading) {
    return (
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading your active orders...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh}>Retry</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-8 md:py-12 bg-gradient-to-br from-background to-muted/20"
      aria-label="Your active orders"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
              <Link to="/dashboard/orders">
                <Eye className="w-4 h-4" />
                View All Orders
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
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
              <SelectItem value="payment_sent">Payment Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        {hasOrders && (
          <p className="text-center text-muted-foreground mb-6">
            Showing {filteredOrders.length} of {orders.length} active orders
          </p>
        )}

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="w-full">
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
                    <tr
                      key={order._id}
                      className="border-b border-border/20 hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-muted-foreground">
                        {order._id}
                      </td>
                      <td className="p-4">
                        <ItemLink productId={getProductId(order)}>
                          <div className="font-medium text-foreground">
                            {getItemName(order)}
                          </div>
                          <div className="text-sm text-primary font-semibold">
                            ${order.totalAmount}
                          </div>
                        </ItemLink>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{getSellerName(order)}</span>
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
                        {formatDate(order.createdAt)}
                        {isToday(order.createdAt) && (
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
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {order._id}
                      </span>
                      <Badge variant={getStatusInfo(order.status).color}>
                        {getStatusInfo(order.status).label}
                      </Badge>
                    </div>
                    <ItemLink productId={getProductId(order)}>
                      <h3 className="font-medium text-foreground mb-1">
                        {getItemName(order)}
                      </h3>
                      <p className="text-primary font-semibold mb-2">
                        ${order.totalAmount}
                      </p>
                    </ItemLink>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{getSellerName(order)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                        {isToday(order.createdAt) && (
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No active orders yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by browsing new listings or posting your own.
            </p>
            <Button asChild>
              <Link to="/listings">Browse Listings</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ActiveOrders;
