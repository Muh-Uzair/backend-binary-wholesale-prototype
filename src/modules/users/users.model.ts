import { Document, model, Schema } from "mongoose";

export const userRoles = ["admin", "retailer"] as const;
export type UserRole = (typeof userRoles)[number];

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string; // optional field
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    role: {
      type: String,
      enum: userRoles,
      required: [true, "Role is required"],
      lowercase: true,
      default: "retailer",
    },

    phone: {
      type: String,
      trim: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^[0-9+\-]*$/,
        "Phone number can only contain digits (0-9), + and -",
      ],
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
