import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { acceptOrder, getOrderById } from "@/api/order";
import type { Order, OrderResponse, OrderStatus } from "@/types/order";
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
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Truck,
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

function OrderAcceptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
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
        const response: OrderResponse = await getOrderById(id!);
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

  const handleAccept = async () => {
    if (!id || !order) return;
    try {
      setAccepting(true);
      setError(null);
      const response: OrderResponse = await acceptOrder(id);
      setOrder(response.order);
      // Optionally redirect or show success message
      navigate("/dashboard/orders"); // Redirect to orders list after acceptance
    } catch (err) {
      console.error("Failed to accept order:", err);
      setError("Failed to accept order. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

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

  const { buyer, product, quantity, totalAmount, status, createdAt } = order;
  const productDetails = getProductDetails(product);
  const buyerName = getUserName(buyer);

  const isPending = status === "pending";

  if (!isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            This order is no longer pending.
          </p>
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
              Accept Order #{order._id}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(createdAt)}
            </p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>

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
                {productDetails.image && (
                  <img
                    src={productDetails.image}
                    alt={productDetails.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {productDetails.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {quantity}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      ${(totalAmount / quantity).toFixed(2)} each
                    </span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      Total:
                    </span>
                    <span className="text-lg font-bold">
                      ${totalAmount.toFixed(2)}
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
                <p className="text-sm font-medium">{buyerName}</p>
                {typeof buyer !== "string" && buyer.email && (
                  <p className="text-sm text-muted-foreground">{buyer.email}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  asChild
                >
                  <Link
                    to={`/buyer/${
                      typeof buyer === "string" ? buyer : buyer._id
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
                <Alert className="bg-blue/10 border-blue/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Accepting this order will notify the buyer to proceed with
                    payment.
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
                {error && (
                  <p className="text-sm text-destructive text-center">
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderAcceptPage;
