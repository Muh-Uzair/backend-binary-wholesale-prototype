import { Request, Response, NextFunction } from "express";
import UserModel from "@/modules/users/users.model";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const adminEmail = "admin@example.com";

    const user = await UserModel.findOne({ email: adminEmail });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Admin user not found in database",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        message: error?.message,
      });
      return;
    } else {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }
  }
};
