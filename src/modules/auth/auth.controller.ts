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
      throw new Error("Signup failed");
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

export const signin = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("res --------------------------------------------\n", req);

    res.status(200).json({
      status: "success",
      message: "Signin successful",
    });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        status: "failed",
        message: "An error occurred",
        error: "An error occurred",
      });
    }
  }
};
