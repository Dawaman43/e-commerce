import cloudinary from "../libs/cloudinary.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const allowedStatuses = [
  "pending",
  "payment_sent",
  "paid",
  "shipped",
  "completed",
  "cancelled",
];

export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user?.id;
    const { seller, product, quantity } = req.body;

    if (!buyerId) {
      console.error("Error: buyerId not found in req.user");
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!seller || !product || !quantity) {
      console.error("Error: Missing seller, product, or quantity");
      return res
        .status(400)
        .json({ error: "Seller, product, and quantity are required" });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      console.error("Error: Invalid quantity:", quantity);
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }

    console.log("Step 2: Fetching product:", product);
    const productData = await Product.findById(product);
    if (!productData) {
      console.error("Error: Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    if (qty > Number(productData.stock)) {
      console.error(
        `Error: Requested quantity (${qty}) exceeds stock (${productData.stock})`
      );
      return res
        .status(400)
        .json({ error: "Requested quantity exceeds stock" });
    }

    const totalAmount = productData.price * qty;
    console.log("Step 3: Calculated totalAmount:", totalAmount);

    console.log("Step 4: Creating order...");
    const newOrder = await Order.create({
      buyer: buyerId,
      seller,
      product,
      quantity: qty,
      totalAmount,
      status: "pending",
      deliveryStatus: "pending",
    });

    console.log("Step 5: Reducing product stock");
    productData.stock = Number(productData.stock) - qty;
    await productData.save();

    console.log("Step 6: Populating order for response");
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price");

    console.log("Step 7: Order created successfully:", populatedOrder._id);

    res
      .status(201)
      .json({ message: "Order created successfully", order: populatedOrder });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price");

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Get all orders error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrdersByBuyer = async (req, res) => {
  try {
    const { buyerId } = req.params;

    const orders = await Order.find({ buyer: buyerId })
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price");

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this buyer" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Get orders by buyer error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrdersBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ seller: sellerId })
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price");

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.log("Get orders by seller error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.log("Get order by ID error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    if (status === "shipped") order.deliveryStatus = "shipped";
    if (status === "completed") order.deliveryStatus = "delivered";

    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.log("Update order status error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.paymentConfirmedBySeller = true;
    order.status = "paid";

    await order.save();

    res.status(200).json({ message: "Payment confirmed by seller", order });
  } catch (error) {
    console.log("Confirm payment error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const uploadPaymentProof = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "Payment proof is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.paymentConfirmedBySeller) {
      return res
        .status(403)
        .json({ error: "Seller must confirm payment before uploading proof" });
    }

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "payment_proofs", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    order.paymentProof = uploaded.secure_url;
    order.status = "payment_sent";
    await order.save();

    console.log("Uploaded to Cloudinary:", uploaded.secure_url);

    res.status(200).json({ message: "Payment proof uploaded", order });
  } catch (error) {
    console.log("Upload payment proof error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateDeliveryInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, courier, shippedAt, deliveredAt } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    if (trackingNumber) order.deliveryInfo.trackingNumber = trackingNumber;
    if (courier) order.deliveryInfo.courier = courier;
    if (shippedAt) order.deliveryInfo.shippedAt = new Date(shippedAt);
    if (deliveredAt) order.deliveryInfo.deliveredAt = new Date(deliveredAt);

    if (deliveredAt) {
      order.deliveryStatus = "delivered";
      order.status = "completed";
    } else if (shippedAt) {
      order.deliveryStatus = "shipped";
      order.status = "shipped";
    } else {
      order.deliveryStatus = "pending";
      if (order.status === "pending") order.status = "pending";
    }

    await order.save();
    console.log("Delivery info updated:", order.deliveryInfo);

    res
      .status(200)
      .json({ message: "Delivery info updated successfully", order });
  } catch (error) {
    console.error("Update delivery info error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("CancelOrder called for order:", orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "cancelled") {
      console.warn("Order already cancelled:", orderId);
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    order.status = "cancelled";
    order.deliveryStatus = "pending";
    await order.save();
    console.log("Order cancelled:", orderId);

    const product = await Product.findById(order.product);
    if (product) {
      product.stock = Number(product.stock) + Number(order.quantity);
      await product.save();
      console.log("Restored product stock for:", product._id);
    }

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
