import jwt from "jsonwebtoken";
import User from "../models/userModel.ts";
import asyncHandler from "./asyncHandler.ts";

const authenticate = asyncHandler(async (req: any, res: any, next: any) => {
  let token;
  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (req as any).user = await User.findById((decoded as any).userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};



export { authenticate, authorizeAdmin };