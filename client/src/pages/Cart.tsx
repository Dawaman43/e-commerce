import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/api/cart";
import { createOrder } from "@/api/order";
import type { CartResponse, CartItem } from "@/types/cart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  AlertCircle,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface LocalCart {
  items: CartItem[];
  total: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<LocalCart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce(
      (sum, item) =>
        sum + parseFloat(item.product.price as string) * item.quantity,
      0
    );
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: CartResponse = await getCart();
      const items = response.cart?.items || [];
      setCart({ items, total: calculateTotal(items) });
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      setUpdating(true);
      await updateCartItem(productId, {
        quantity: newQuantity,
      });
      await fetchCart();
    } catch (err: any) {
      console.error("Failed to update cart item:", err);
      setError("Failed to update quantity. Please try again.");
      await fetchCart(); // Refetch to revert
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setUpdating(true);
      await removeCartItem(productId);
      await fetchCart();
      // Clean up message for removed item
      setMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[productId];
        return newMessages;
      });
    } catch (err: any) {
      console.error("Failed to remove cart item:", err);
      setError("Failed to remove item. Please try again.");
      await fetchCart(); // Refetch to revert
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      setUpdating(true);
      await clearCart();
      setCart({ items: [], total: 0 });
      setMessages({});
    } catch (err: any) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear cart. Please try again.");
      await fetchCart(); // Refetch to revert
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenOrderModal = (item: CartItem) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedItem || !selectedItem.product._id) return;

    try {
      setOrdering(selectedItem.product._id);
      const sellerId =
        typeof selectedItem.product.seller === "string"
          ? selectedItem.product.seller
          : selectedItem.product.seller._id;
      const payload = {
        seller: sellerId,
        product: selectedItem.product._id,
        quantity: selectedItem.quantity,
      };
      const response = await createOrder(payload);
      toast.success("Order created successfully!");
      handleCloseModal();
      await fetchCart(); // Refresh cart
      navigate(`/orders/${response.order._id}`);
    } catch (err: any) {
      console.error("Failed to create order:", err);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setOrdering(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some items to get started.
            </p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.items.map((item) => {
                const itemTotal =
                  parseFloat(item.product.price as string) * item.quantity;
                const itemMessage = messages[item.product._id] || "";

                return (
                  <Card key={item.product._id} className="overflow-hidden">
                    <div className="flex flex-row p-4">
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img
                          src={item.product.images?.[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <CardTitle className="text-lg font-semibold">
                          {item.product.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {item.product.description?.substring(0, 100)}...
                        </CardDescription>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            ${item.product.price}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Subtotal: ${itemTotal.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={updating}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.product._id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center"
                            min={1}
                            disabled={updating}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={updating}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveItem(item.product._id)}
                            disabled={updating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Optional message to seller..."
                            value={itemMessage}
                            onChange={(e) =>
                              setMessages((prev) => ({
                                ...prev,
                                [item.product._id]: e.target.value,
                              }))
                            }
                            className="min-h-[60px] resize-none"
                          />
                          <Button
                            onClick={() => handleOpenOrderModal(item)}
                            disabled={ordering === item.product._id}
                            className="w-full"
                          >
                            {ordering === item.product._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Order Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                  setSelectedItem(null);
                }
              }}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Order</DialogTitle>
                  <DialogDescription>
                    Review your order details before sending to the seller.
                  </DialogDescription>
                </DialogHeader>
                {selectedItem && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {selectedItem.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {selectedItem.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price: ${selectedItem.product.price}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        Total: $
                        {(
                          parseFloat(selectedItem.product.price as string) *
                          selectedItem.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                    {messages[selectedItem.product._id] && (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Message:</p>
                        <p className="text-sm">
                          {messages[selectedItem.product._id]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmOrder}
                    disabled={ordering === selectedItem?.product._id}
                  >
                    {ordering === selectedItem?.product._id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Confirm & Send
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Separator />

            <div className="flex justify-between items-center py-4 bg-muted/50 rounded-md p-4">
              <div className="text-lg font-semibold">
                Cart Total: ${cart.total.toFixed(2)}
              </div>
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={updating}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
