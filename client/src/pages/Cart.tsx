import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart } from "@/api/cart";
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
import {
  Loader2,
  AlertCircle,
  Trash2,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface LocalCart {
  items: CartItem[];
  total: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<LocalCart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
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
      const response: CartResponse = await updateCartItem(productId, {
        quantity: newQuantity,
      });
      const items = response.cart?.items || [];
      setCart({ items, total: calculateTotal(items) });
    } catch (err: any) {
      console.error("Failed to update cart item:", err);
      setError("Failed to update quantity. Please try again.");
      fetchCart(); // Refetch to revert
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      setUpdating(true);
      const response: CartResponse = await removeCartItem(productId);
      const items = response.cart?.items || [];
      setCart({ items, total: calculateTotal(items) });
    } catch (err: any) {
      console.error("Failed to remove cart item:", err);
      setError("Failed to remove item. Please try again.");
      fetchCart(); // Refetch to revert
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
    } catch (err: any) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear cart. Please try again.");
      fetchCart(); // Refetch to revert
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
            <div className="space-y-4 mb-8">
              {cart.items.map((item) => (
                <Card
                  key={item.product._id}
                  className="flex flex-row items-center p-4"
                >
                  <CardHeader className="w-24 h-24 flex-shrink-0 p-0 mr-4">
                    <img
                      src={item.product.images?.[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </CardHeader>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {item.product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      {item.product.description?.substring(0, 100)}...
                    </CardDescription>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold">
                        ${item.product.price}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Qty: {item.quantity}
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
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between items-center py-4">
              <div className="text-lg font-semibold">
                Subtotal: ${cart.total.toFixed(2)}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  disabled={updating}
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={updating || cart.items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
