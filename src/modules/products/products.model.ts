// models/Product.ts
import { Document, model, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string;
  variants: string[];
  createdBy: Types.ObjectId;
  stock: number;
  inStock: boolean;
  moq: number;
  price: number; // Added price field
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      enum: ["grocery", "beauty"],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, "Brand name is required"],
    },
    images: {
      type: String,
      required: [true, "At least one product image is required"],
    },
    variants: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "696fe283f0d40467fb2337ae",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: false,
    },
    moq: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct>("Product", productSchema);
export default Product;
