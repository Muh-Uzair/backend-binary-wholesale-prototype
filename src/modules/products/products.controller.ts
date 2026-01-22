// controllers/products.controller.ts
import { Request, Response } from "express";
import Product, { IProduct } from "./products.model";

// Create Product (only admin allowed)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body as Partial<IProduct>;

    // Admin check
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can create products" });
    }

    const newProduct = new Product({
      ...productData,
      createdBy: req.user._id,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get All Products - with pagination, search, category, and price filters
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const categories = (req.query.categories as string) || "";
    const minPrice = parseFloat(req.query.minPrice as string) || 0;
    const maxPrice =
      parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;

    const query: any = {};

    // Search filter - name, brand, or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (categories) {
      const categoryArray = categories
        .split(",")
        .map((c) => c.trim().toLowerCase());
      query.category = { $in: categoryArray };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (minPrice >= 0) query.price.$gte = minPrice;
      if (maxPrice < Number.MAX_SAFE_INTEGER) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // newest first
      .lean();

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get Single Product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update Product by ID (admin only)
export const updateProductById = async (req: Request, res: Response) => {
  try {
    // Admin check
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can update products" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete Product by ID (admin only)
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    // Admin check
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can delete products" });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
