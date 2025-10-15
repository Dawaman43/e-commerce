import cloudinary from "../libs/cloudinary.js";
import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;

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
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          });
        })
      );
    }

    const newProduct = await Product.create({
      seller: req.user._id,
      name,
      description: description || "",
      category: category || "Uncategorized",
      price,
      stock,
      images: uploadedImages,
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

    const filter = {};

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") filter.stock = { $gt: 0 };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ [sortBy]: order === "desc" ? -1 : 1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update a product
 * Only the seller of the product can update
 */
export const updateProduct = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete a product
 * Only the seller of the product can delete
 */
export const deleteProduct = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all products from a specific seller
 */
export const getProductsBySeller = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Get products by seller error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get top-rated products
 */
export const getTopRatedProducts = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Get top-rated products error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Add a review to a product
 */
export const addReview = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update a review
 */
export const updateReview = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete a review
 */
export const deleteReview = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all reviews for a product
 */
export const getProductReviews = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Increment product stock (e.g., after restock)
 */
export const incrementProductStock = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Increment product stock error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Decrement product stock (e.g., after purchase)
 */
export const decrementProductStock = async (req, res) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Decrement product stock error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Calculate product rating from reviews
 */
export const calculateProductRating = async (productId) => {
  try {
    // TODO: implement
  } catch (error) {
    console.error("Calculate product rating error:", error);
  }
};
