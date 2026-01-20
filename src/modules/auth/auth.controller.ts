import { Request, Response, NextFunction } from "express";

export const signup = (req: Request, res: Response, next: NextFunction) => {
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
