import { jwt_secret } from "../lib/config.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export default protectedRoute = async (res, req, next) => {
  try {
    const token = res.cookies.jwt;

    if (!token)
      res.status(400).json({ error: "Unathorization , No token Provider" });

    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded) res.status(400).json({ error: "Invalid Token" });

    const user = User.findById(decoded.userId).select("-password");

    if (!user) res.status(400).json({ error: "User not found" });

    req.user = user;
    next();
    
  } catch (error) {
    console.log("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
