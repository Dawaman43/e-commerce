import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

// 1️⃣ Create a new order
export const createOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { seller, product, quantity } = req.body;

    if (!seller || !product || !quantity) {
      return res
        .status(400)
        .json({ error: "Seller, product, and quantity are required" });
    }

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (Number(quantity) > Number(productData.stock)) {
      return res
        .status(400)
        .json({ error: "Requested quantity exceeds stock" });
    }

    const totalAmount = productData.price * quantity;

    const newOrder = await Order.create({
      buyer: buyerId,
      seller,
      product,
      quantity,
      totalAmount,
      status: "pending",
      deliveryStatus: "pending",
    });

    productData.stock = Number(productData.stock) - Number(quantity);
    await productData.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.log("Create order error: ", error);
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

// 6️⃣ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    // TODO: Validate status
    // TODO: Update order status
  } catch (error) {
    console.log("Update order status error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 7️⃣ Confirm payment (by seller)
export const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    // TODO: Set paymentConfirmedBySeller to true
    // TODO: Update status to 'paid'
  } catch (error) {
    console.log("Confirm payment error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 8️⃣ Upload payment proof (by buyer)
export const uploadPaymentProof = async (req, res) => {
  try {
    const { orderId } = req.params;
    // TODO: Save payment proof
    // TODO: Update status to 'payment_sent'
  } catch (error) {
    console.log("Upload payment proof error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 9️⃣ Update delivery info
export const updateDeliveryInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, courier, shippedAt, deliveredAt } = req.body;
    // TODO: Update deliveryInfo object
    // TODO: Update deliveryStatus accordingly
  } catch (error) {
    console.log("Update delivery info error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔟 Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    // TODO: Update status to 'cancelled'
  } catch (error) {
    console.log("Cancel order error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 1️⃣1️⃣ Delete order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    // TODO: Delete order from DB
  } catch (error) {
    console.log("Delete order error: ", error);
    res.status(500).json({ error: "Server error" });
  }
};
