import express, { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "./products.controller";
import { protect } from "@/middleware/protect";

const router: Router = express.Router();

// base url : root/api/v1/products

router.route("/").post(protect, createProduct);
router.route("/").get(getAllProducts);
router.route("/:id").get(getProductById);
router.route("/:id").patch(protect, updateProductById);
router.route("/:id").delete(protect,  deleteProductById);

export default router;
