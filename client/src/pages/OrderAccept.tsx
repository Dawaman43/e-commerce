import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { acceptOrder, getOrderById, getOrdersBySeller } from "@/api/order";
import type {
  OrdersResponse,
  Order,
  OrderResponse,
  OrderStatus,
} from "@/types/order";
import type { Product } from "@/types/product";
import type { User as UserType } from "@/types/user";
import {
  Package,
  User,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Truck,
  Info,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

// Simple ObjectId validator
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: BadgeVariant; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "outline",
    icon: <Clock className="w-4 h-4" />,
  },
  payment_sent: {
    label: "Payment Sent",
    color: "secondary",
    icon: <Clock className="w-4 h-4" />,
  },
  paid: {
    label: "Paid",
    color: "outline",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  shipped: {
    label: "Shipped",
    color: "secondary",
    icon: <Truck className="w-4 h-4" />,
  },
  completed: {
    label: "Completed",
    color: "default",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "destructive",
    icon: <XCircle className="w-4 h-4" />,
  },
} as const;

const getStatusInfo = (
  status: OrderStatus
): { label: string; color: BadgeVariant; icon: React.ReactNode } => {
  return statusConfig[status];
};

const getUserName = (user: UserType | string): string => {
  if (typeof user === "string") return user;
  return user.name || "";
};

const getProductDetails = (product: Product | string | null | undefined) => {
  if (typeof product === "string")
    return { name: product, image: "", price: "" };
  if (!product) return { name: "Unknown Product", image: "", price: "" };
  return {
    name: product.name || "Unknown Product",
    image: product.images?.[0] || "",
    price: product.price || "",
  };
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function OrderAcceptPage() {
  const { user } = useAuth();
  const sellerId = user?.id;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (
        !sellerId ||
        sellerId === "current-seller-id" ||
        !isValidObjectId(sellerId)
      ) {
        // Keep loading until valid ID; auth will update
        setError(null); // Clear any prior error
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response: OrdersResponse = await getOrdersBySeller(sellerId);
        // Filter for pending orders only
        const pendingOrders = response.orders.filter(
          (order) => order.status === "pending"
        );
        setOrders(pendingOrders);
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
        setError("no order found to accept");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [sellerId]);

  useEffect(() => {
    let mounted = true;

    const fetchOrderDetails = async () => {
      if (!selectedId || !isOpen) return;

      if (!isValidObjectId(selectedId)) {
        if (mounted) {
          setModalError("Invalid order ID");
          setModalLoading(false);
        }
        return;
      }

      setModalLoading(true);
      setModalError(null);

      try {
        const response: OrderResponse = await getOrderById(selectedId);
        if (mounted) {
          setSelectedOrder(response.order);
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        if (mounted) {
          setModalError("Failed to load order details. Please try again.");
        }
      } finally {
        if (mounted) {
          setModalLoading(false);
          setSelectedId(null);
        }
      }
    };

    fetchOrderDetails();

    return () => {
      mounted = false;
    };
  }, [isOpen, selectedId]);

  const handleAccept = async () => {
    if (!selectedOrder) return;
    try {
      setAccepting(true);
      setModalError(null);
      const response: OrderResponse = await acceptOrder(selectedOrder._id);
      // Update the orders list by removing the accepted order (no longer pending)
      setOrders((prev) => prev.filter((o) => o._id !== selectedOrder._id));
      setSuccess(true);
    } catch (err) {
      console.error("Failed to accept order:", err);
      setModalError("Failed to accept order. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
    setSelectedId(null);
    setSuccess(false);
    setModalError(null);
  };

  // Show loading if no valid sellerId yet
  if (
    loading &&
    (!sellerId ||
      sellerId === "current-seller-id" ||
      !isValidObjectId(sellerId))
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading seller session...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pending orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Order Found to Accept
            </h2>
            <p className="text-muted-foreground mb-6">
              There are no pending orders available for acceptance at the
              moment.
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Order Found to Accept
            </h2>
            <p className="text-muted-foreground mb-6">
              There are no pending orders available for acceptance at the
              moment.
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Pending Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and accept orders from buyers
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard/orders">View All Orders</Link>
          </Button>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              const {
                _id,
                buyer,
                product,
                quantity,
                totalAmount,
                status,
                createdAt,
              } = order;
              const productDetails = getProductDetails(product);
              const buyerName = getUserName(buyer);

              return (
                <Card key={_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        Order #{_id.slice(-6)}
                      </span>
                      <Badge
                        variant={getStatusInfo(status).color}
                        className="flex items-center gap-1"
                      >
                        {getStatusInfo(status).icon}
                        {getStatusInfo(status).label}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product */}
                    <div className="flex items-start gap-3">
                      {productDetails.image && (
                        <img
                          src={productDetails.image}
                          alt={productDetails.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {productDetails.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {quantity}
                        </p>
                      </div>
                    </div>

                    {/* Buyer */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Buyer: {buyerName}</p>
                      {typeof buyer !== "string" && buyer.email && (
                        <p className="text-xs text-muted-foreground">
                          {buyer.email}
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Total:
                      </span>
                      <span className="text-lg font-bold">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Action */}
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedId(_id)}
                        className="w-full"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Details & Accept
                      </Button>
                    </DialogTrigger>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Order #{selectedOrder?._id?.slice(-6) || "Unknown"} Details
              </DialogTitle>
            </DialogHeader>
            {modalLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
                <p className="text-muted-foreground">Loading details...</p>
              </div>
            ) : modalError ? (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{modalError}</AlertDescription>
              </Alert>
            ) : selectedOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-1">
                {/* Main Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Badge */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={getStatusInfo(selectedOrder.status).color}
                          className="flex items-center gap-1"
                        >
                          {getStatusInfo(selectedOrder.status).icon}
                          {getStatusInfo(selectedOrder.status).label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Product Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        const pd = getProductDetails(selectedOrder.product);
                        return pd.image ? (
                          <img
                            src={pd.image}
                            alt={pd.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : null;
                      })()}
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {(() => {
                            const pd = getProductDetails(selectedOrder.product);
                            return pd.name;
                          })()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {selectedOrder.quantity}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            $
                            {selectedOrder.quantity > 0
                              ? (
                                  selectedOrder.totalAmount /
                                  selectedOrder.quantity
                                ).toFixed(2)
                              : "0.00"}{" "}
                            each
                          </span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <span className="text-sm text-muted-foreground">
                            Total:
                          </span>
                          <span className="text-lg font-bold">
                            ${selectedOrder.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Buyer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Buyer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm font-medium">
                        {getUserName(selectedOrder.buyer)}
                      </p>
                      {typeof selectedOrder.buyer !== "string" &&
                        selectedOrder.buyer.email && (
                          <p className="text-sm text-muted-foreground">
                            {selectedOrder.buyer.email}
                          </p>
                        )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        asChild
                      >
                        <Link
                          to={`/buyer/${
                            typeof selectedOrder.buyer === "string"
                              ? selectedOrder.buyer
                              : selectedOrder.buyer._id
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Buyer
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Accept Action */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Action</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!success ? (
                        <>
                          <Alert className="bg-blue/10 border-blue/20">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              Accepting this order will notify the buyer to
                              proceed with payment.
                            </AlertDescription>
                          </Alert>
                          <Button
                            onClick={handleAccept}
                            disabled={accepting}
                            className="w-full"
                          >
                            {accepting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Order
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Alert className="bg-green/10 border-green/20">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Order accepted successfully! The buyer has been
                              notified.
                            </AlertDescription>
                          </Alert>
                          <Button onClick={handleCloseModal} className="w-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Close
                          </Button>
                        </>
                      )}
                      {modalError && !success && (
                        <p className="text-sm text-destructive text-center">
                          {modalError}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default OrderAcceptPage;
