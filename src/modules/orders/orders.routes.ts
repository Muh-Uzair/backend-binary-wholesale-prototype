import express, { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} from "../orders/orders.controller";

const router: Router = express.Router();

// base url : root/api/v1/orders

router.route("/").post(createOrder).get(getAllOrders);
router
  .route("/:id")
  .get(getOrderById)
  .patch(updateOrderById)
  .delete(deleteOrderById);

export default router;
