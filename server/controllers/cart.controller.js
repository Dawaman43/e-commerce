import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const addCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Add cart error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ cart: { items: [] } });
    }

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    return res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Remove cart item error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ user: userId });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
