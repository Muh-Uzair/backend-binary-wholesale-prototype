// controllers/orderController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "./orders.model";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body.orderData);

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      isPaid,
      isDelivered,
      userId,
      search,
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (isPaid !== undefined) {
      filter.isPaid = isPaid === "true";
    }

    if (isDelivered !== undefined) {
      filter.isDelivered = isDelivered === "true";
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) {
      filter.user = new mongoose.Types.ObjectId(userId as string);
    }

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.phone": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter)
      .populate("user", "fullName email phone")
      .populate("orderItems.product", "name brand price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// @desc    Update order by ID
// @route   PATCH /api/v1/orders/:id
// @access  Private/Admin
export const updateOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update specific fields
    if (updateData.status) {
      order.status = updateData.status;
    }

    if (updateData.isPaid !== undefined) {
      order.isPaid = updateData.isPaid;
      if (updateData.isPaid && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    if (updateData.isDelivered !== undefined) {
      order.isDelivered = updateData.isDelivered;
      if (updateData.isDelivered && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }

    if (updateData.shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...updateData.shippingAddress,
      };
    }

    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: populatedOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// @desc    Delete order by ID
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
export const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};
