import { Request, Response, NextFunction } from "express";
import UserModel from "../users/users.model";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fullName, email, password, role, phone } = req.body;

    if (!fullName || !email || !password || !role || !phone) {
      throw new Error("Fullname, email, password, role, phone are required");
    }

    const newUser = await UserModel.create({
      fullName,
      email,
      password,
      role,
      phone,
    });

    if (!newUser) {
      throw new Error("User not created");
    }

    res.status(200).json({
      status: "success",
      message: "Signin successful",
      data: newUser,
    });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "failed",
        message: "Signup failed",
      });
    }
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const existingUser = await UserModel.findOne({ email, password });

    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      status: "success",
      message: "Signin successful",
      data: existingUser,
    });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "failed",
        message: "Sign in failed",
      });
    }
  }
};
