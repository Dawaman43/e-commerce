import mongoose from "mongoose";
import cloudinary from "../libs/cloudinary.js";
import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, paymentOptions } =
      req.body;

    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ error: "Name, price, and stock are required." });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Seller not found." });
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result.secure_url);
                }
              );
              stream.end(file.buffer);
            })
        )
      );
    }

    // Validate payment options
    const allowedOptions = ["bank_transfer", "telebirr", "mepesa"];
    const validatedPaymentOptions = Array.isArray(paymentOptions)
      ? paymentOptions.filter(
          (opt) =>
            opt.method &&
            allowedOptions.includes(opt.method) &&
            opt.accountNumber &&
            opt.accountNumber.trim() !== ""
        )
      : [];

    if (validatedPaymentOptions.length === 0) {
      return res.status(400).json({
        error:
          "At least one valid payment option with accountNumber is required.",
      });
    }

    const newProduct = await Product.create({
      seller: req.user._id,
      name,
      description: description || "",
      category: category || "Uncategorized",
      price,
      stock,
      images: uploadedImages,
      paymentOptions: validatedPaymentOptions,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    console.log("Full req.query:", req.query);

    const filter = {};

    if (
      category &&
      String(category).trim() &&
      String(category).trim() !== "undefined"
    ) {
      const trimmedCat = String(category).trim();
      filter.category = { $regex: new RegExp(trimmedCat, "i") };
      console.log("Category filter added for:", trimmedCat);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") filter.stock = { $gt: 0 };

    if (
      search &&
      String(search).trim() &&
      String(search).trim() !== "undefined"
    ) {
      const trimmedSearch = String(search).trim();
      filter.$or = [
        { name: { $regex: trimmedSearch, $options: "i" } },
        { description: { $regex: trimmedSearch, $options: "i" } },
      ];
      console.log("Added $or for search:", trimmedSearch);
    }

    console.log("Final filter:", JSON.stringify(filter, null, 2));

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .populate("seller", "name");

    console.log("Products found count:", products.length);

    // Map products to include only the first payment option if exists
    const productsWithPayment = products.map((p) => {
      const chosenPayment =
        p.paymentOptions && p.paymentOptions.length > 0
          ? p.paymentOptions[0]
          : null;
      return {
        ...p.toObject(),
        chosenPayment,
      };
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
      products: productsWithPayment,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findById(id)
      .populate("seller", "name email")
      .populate("reviews.user", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ADD THESE LOGS BEFORE DESTRUCTURING TO DIAGNOSE
    console.log("=== UPDATE PRODUCT DEBUG ===");
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("Content-Type header:", req.headers["content-type"]);
    console.log("req.body (before destructuring):", req.body);
    console.log("req.files (before processing):", req.files);
    console.log("Full req.body type:", typeof req.body);
    console.log("Is req.body an object?", typeof req.body === "object");
    console.log("============================");

    // Multer parses multipart/form-data; all text fields are strings
    const { name, description, category, price, stock, existingImages } =
      req.body || {}; // ADD FALLBACK: || {} to prevent destructuring error if undefined

    console.log("REQ.BODY after destructuring:", req.body); // Debug
    console.log("REQ.FILES after destructuring:", req.files); // Debug

    // Parse existingImages (may come as JSON string)
    let parsedExistingImages = [];
    if (existingImages) {
      try {
        parsedExistingImages = JSON.parse(existingImages);
        console.log("Parsed existingImages:", parsedExistingImages);
      } catch (parseErr) {
        console.error("Parse existingImages error:", parseErr);
        parsedExistingImages = Array.isArray(existingImages)
          ? existingImages
          : [existingImages];
      }
    } else {
      console.log("No existingImages provided");
    }

    // Upload new images to Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      console.log("Uploading new images:", req.files.length);
      uploadedImages = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result.secure_url);
                }
              );
              stream.end(file.buffer);
            })
        )
      );
      console.log("Uploaded new images URLs:", uploadedImages);
    } else {
      console.log("No new files to upload");
    }

    // Build update object
    const updatedFields = {
      images: [...parsedExistingImages, ...uploadedImages],
    };
    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (category) updatedFields.category = category;
    if (price !== undefined) updatedFields.price = Number(price);
    if (stock !== undefined) updatedFields.stock = Number(stock);

    console.log("Updated fields to apply:", updatedFields);

    // Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product updated successfully:", updatedProduct._id);

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!req.user || product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this product." });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") },
    }).populate("seller", "name email");

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this category." });
    }

    return res.status(200).json({
      message: `Products in category "${category}" fetched successfully`,
      products,
    });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(q, "i") } },
        { description: { $regex: new RegExp(q, "i") } },
      ],
    }).populate("seller", "name email");

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found matching your query." });
    }

    return res.status(200).json({
      message: `Products matching "${q}" fetched successfully`,
      products,
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: "Invalid seller ID." });
    }

    const products = await Product.find({ seller: sellerId }).populate(
      "seller",
      "name email"
    );

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this seller." });
    }

    return res.status(200).json({
      message: "Products fetched successfully for this seller",
      products,
    });
  } catch (error) {
    console.error("Get products by seller error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getTopRatedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find()
      .sort({ rating: -1 })
      .limit(limit)
      .populate("seller", "name email");

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No top-rated products found." });
    }

    return res.status(200).json({
      message: "Top-rated products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get top-rated products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    if (rating == null || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const review = {
      user: req.user._id,
      comment: comment || "",
      rating,
    };

    product.reviews.push(review);
    await product.save();

    await calculateProductRating(productId);

    await product.populate({
      path: `reviews.${product.reviews.length - 1}.user`,
      select: "name email",
    });

    const newReview = product.reviews[product.reviews.length - 1];

    return res.status(201).json({
      message: "Review added successfully",
      review: {
        id: newReview._id,
        user: newReview.user,
        comment: newReview.comment,
        rating: newReview.rating,
      },
      productRating: product.rating,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID." });
    }
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 0 and 5." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found." });

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update your own reviews." });
    }

    if (comment !== undefined) review.comment = comment;
    if (rating !== undefined) review.rating = rating;

    await product.save();

    await calculateProductRating(productId);

    await product.populate({
      path: `reviews.${product.reviews.findIndex((r) =>
        r._id.equals(reviewId)
      )}.user`,
      select: "name email",
    });

    const updatedReview = product.reviews.id(reviewId);

    return res.status(200).json({
      message: "Review updated successfully",
      review: {
        id: updatedReview._id,
        user: updatedReview.user,
        comment: updatedReview.comment,
        rating: updatedReview.rating,
      },
      productRating: product.rating,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const review = product.reviews.find((r) => r._id.toString() === reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own reviews." });
    }

    // ✅ Remove review by filtering
    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId
    );

    // Recalculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    await product.populate("reviews.user", "name email");

    return res.status(200).json({
      message: "Review deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    const product = await Product.findById(productId).populate(
      "reviews.user",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.status(200).json({
      message: `Reviews for product "${product.name}" fetched successfully`,
      reviews: product.reviews,
      averageRating: product.rating,
      totalReviews: product.reviews.length,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const incrementProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update stock for your own products." });
    }

    const currentStock = parseInt(product.stock) || 0;
    product.stock = (currentStock + amount).toString();

    await product.save();

    return res.status(200).json({
      message: `Product stock increased by ${amount}`,
      product,
    });
  } catch (error) {
    console.error("Increment product stock error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const decrementProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You can only update stock for your own products." });
    }

    const currentStock = parseInt(product.stock) || 0;
    if (amount > currentStock) {
      return res.status(400).json({
        error: `Cannot decrement by ${amount}. Current stock is ${currentStock}.`,
      });
    }
    product.stock = (currentStock - amount).toString();

    await product.save();

    return res.status(200).json({
      message: `Product stock decreased by ${amount}`,
      product,
    });
  } catch (error) {
    console.error("Decrement product stock error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const calculateProductRating = async (productId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID.");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    const reviews = product.reviews || [];
    if (reviews.length === 0) {
      product.rating = 0;
    } else {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / reviews.length;
      product.rating = parseFloat(avgRating.toFixed(2));
    }

    await product.save();

    return product.rating;
  } catch (error) {
    console.error("Calculate product rating error:", error);
    return 0;
  }
};

export const getSeller = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid seller ID." });
    }

    const seller = await User.findById(id).select(
      "-passwordHash -authId" // exclude sensitive fields
    );

    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    // Fetch products by this seller
    const products = await Product.find({ seller: id });

    return res.status(200).json({
      message: "Seller fetched successfully",
      seller,
      products, // include seller's products
    });
  } catch (error) {
    console.error("Get seller error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getTopSellers = async (req, res) => {
  try {
    const topSellers = await Product.aggregate([
      {
        $group: {
          _id: "$seller",
          productCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      {
        $lookup: {
          from: "reviews",
          let: { sellerId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$sellerId"] } } },
            { $count: "count" },
          ],
          as: "reviewCount",
        },
      },
      { $sort: { productCount: -1, averageRating: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          id: "$seller._id",
          name: "$seller.name",
          email: "$seller.email",
          avatar: "$seller.image", // <-- user profile image
          bio: "$seller.bio",
          location: "$seller.location",
          verified: "$seller.isVerified",
          sales: "$productCount",
          rating: "$averageRating",
          reviews: { $arrayElemAt: ["$reviewCount.count", 0] },
        },
      },
    ]);

    return res.status(200).json({
      message: "Top sellers fetched successfully",
      sellers: topSellers.map((s) => ({
        ...s,
        reviews: s.reviews || 0,
        avatar: s.avatar || "/default-avatar.png", // default image
        bio: s.bio || "",
        location: s.location || "Unknown",
        verified: s.verified || false,
      })),
    });
  } catch (error) {
    console.error("Get top sellers error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
