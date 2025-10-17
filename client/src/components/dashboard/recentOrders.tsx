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
  CheckCircle,
  RefreshCw,
  User,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { getOrders } from "@/api/order";
import type { Order, OrdersResponse, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User as UserType } from "@/types/user";

type RecentOrder = Order & { rating?: number | null };

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const getStatusInfo = (
  status: OrderStatus
): { label: string; color: BadgeVariant } => {
  switch (status) {
    case "completed":
      return { label: "Completed", color: "default" };
    case "shipped":
      return { label: "Delivered", color: "secondary" };
    case "cancelled":
      return { label: "Cancelled", color: "destructive" };
    default:
      return { label: status, color: "outline" };
  }
};

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

function RecentOrders() {
  // State for orders and loading
  const [orders, setOrders] = useState<RecentOrder[]>([]);
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
        // Filter for recent orders only
        const recentStatuses: OrderStatus[] = [
          "completed",
          "shipped",
          "cancelled",
        ];
        const recentOrders = (response.orders || [])
          .filter((order) => recentStatuses.includes(order.status))
          .map((order) => ({ ...order, rating: null } as RecentOrder));
        setOrders(recentOrders);
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
        // Filter for recent orders only
        const recentStatuses: OrderStatus[] = [
          "completed",
          "shipped",
          "cancelled",
        ];
        const recentOrders = (response.orders || [])
          .filter((order) => recentStatuses.includes(order.status))
          .map((order) => ({ ...order, rating: null } as RecentOrder));
        setOrders(recentOrders);
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
  const filteredOrders: RecentOrder[] = orders
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

  // Check if order is recent (within 7 days)
  const isRecent = (dateStr?: string) => {
    if (!dateStr) return false;
    const now = new Date("2025-10-17"); // Current date
    const orderDate = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  if (loading) {
    return (
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Loading your recent orders...
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
      aria-label="Your recent orders"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Recent Orders
            </h2>
            <p className="text-muted-foreground text-sm">
              A look back at your completed trades and purchases.
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
              <Link to="/dashboard/orders/history">
                <Eye className="w-4 h-4" />
                View Order History
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="shipped">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Info */}
        {hasOrders && (
          <p className="text-center text-muted-foreground mb-6">
            Showing {filteredOrders.length} of {orders.length} recent orders
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
                        <div className="font-medium text-foreground">
                          {getItemName(order)}
                        </div>
                        <div className="text-sm text-primary font-semibold">
                          ${order.totalAmount}
                        </div>
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
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {order.status === "completed" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {getStatusInfo(order.status).label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                        {isRecent(order.createdAt) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Recent
                          </Badge>
                        )}
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
                      <Badge
                        variant={getStatusInfo(order.status).color}
                        className={
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : ""
                        }
                      >
                        {order.status === "completed" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {getStatusInfo(order.status).label}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {getItemName(order)}
                    </h3>
                    <p className="text-primary font-semibold mb-2">
                      ${order.totalAmount}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{getSellerName(order)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                        {isRecent(order.createdAt) && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            Recent
                          </Badge>
                        )}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No recent orders
            </h3>
            <p className="text-muted-foreground mb-6">
              Your order history will appear here once you've completed some
              trades.
            </p>
            <Button asChild>
              <Link to="/listings">Start Browsing</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentOrders;
