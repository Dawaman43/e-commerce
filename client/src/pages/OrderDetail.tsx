import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOrderById } from "@/api/order";
import type { Order, OrderResponse, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { User as UserType } from "@/types/user";
import {
  Package,
  User,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";

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
    name: product.name,
    image: product.images[0] || "",
    price: product.price,
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

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!id || fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: OrderResponse = await getOrderById(id);
        setOrder(response.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Order not found"}</p>
          <Button asChild>
            <Link to="/dashboard/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const {
    buyer,
    seller,
    product,
    quantity,
    totalAmount,
    status,
    createdAt,
    deliveryInfo,
    paymentProof,
  } = order;
  const productDetails = getProductDetails(product);
  const sellerName = getUserName(seller);
  const buyerName = getUserName(buyer);

  const isPendingAcceptance = status === "pending";

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" asChild className="h-10 px-3">
            <Link to="/dashboard/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Order #{order._id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(createdAt)}
            </p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>

        {/* Pending Acceptance Alert */}
        {isPendingAcceptance && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This order is pending seller acceptance. You are not accepted yet.
              The seller will review and accept or reject your order soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    variant={getStatusInfo(status).color}
                    className="flex items-center gap-1"
                  >
                    {getStatusInfo(status).icon}
                    {getStatusInfo(status).label}
                  </Badge>
                  {status === "cancelled" && (
                    <p className="text-sm text-destructive">
                      This order has been cancelled.
                    </p>
                  )}
                  {isPendingAcceptance && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <AlertCircle className="inline h-4 w-4 mr-1" />
                        Not accepted yet. Seller has not reviewed this order.
                      </p>
                    </div>
                  )}
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
                {productDetails.image && !isPendingAcceptance && (
                  <img
                    src={productDetails.image}
                    alt={productDetails.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {isPendingAcceptance && (
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground ml-2">
                      Product details unavailable until accepted
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {productDetails.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {quantity}
                  </p>
                  {!isPendingAcceptance && (
                    <div className="flex items-center gap-1 mt-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        ${(totalAmount / quantity).toFixed(2)} each
                      </span>
                    </div>
                  )}
                  {isPendingAcceptance && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Price and details will be available once the seller
                      accepts the order.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPendingAcceptance ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {paymentProof && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Payment Proof:
                        </span>
                        <img
                          src={paymentProof}
                          alt="Payment Proof"
                          className="mt-2 max-w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Payment details will be available after seller acceptance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Info */}
            {deliveryInfo &&
              Object.keys(deliveryInfo).length > 0 &&
              !isPendingAcceptance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {deliveryInfo.trackingNumber && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Tracking Number:
                        </span>
                        <span className="text-sm">
                          {deliveryInfo.trackingNumber}
                        </span>
                      </div>
                    )}
                    {deliveryInfo.courier && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Courier:</span>
                        <span className="text-sm">{deliveryInfo.courier}</span>
                      </div>
                    )}
                    {deliveryInfo.shippedAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          Shipped: {formatDate(deliveryInfo.shippedAt)}
                        </span>
                      </div>
                    )}
                    {deliveryInfo.deliveredAt && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Delivered: {formatDate(deliveryInfo.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            {isPendingAcceptance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Delivery details will be provided after seller acceptance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Seller
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{sellerName}</p>
                {typeof seller !== "string" &&
                  seller.email &&
                  !isPendingAcceptance && (
                    <p className="text-sm text-muted-foreground">
                      {seller.email}
                    </p>
                  )}
                {!isPendingAcceptance && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    asChild
                  >
                    <Link
                      to={`/seller/${
                        typeof seller === "string" ? seller : seller._id
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Link>
                  </Button>
                )}
                {isPendingAcceptance && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Contact available after acceptance.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Buyer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Buyer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{buyerName}</p>
                {typeof buyer !== "string" &&
                  buyer.email &&
                  !isPendingAcceptance && (
                    <p className="text-sm text-muted-foreground">
                      {buyer.email}
                    </p>
                  )}
                {isPendingAcceptance && (
                  <p className="text-sm text-muted-foreground">
                    Buyer details limited until accepted.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/dashboard/orders">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                  </Link>
                </Button>
                {!isPendingAcceptance && status === "pending" && (
                  <Button variant="outline" className="w-full" disabled>
                    Upload Payment Proof
                  </Button>
                )}
                {isPendingAcceptance && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Actions available after seller acceptance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
