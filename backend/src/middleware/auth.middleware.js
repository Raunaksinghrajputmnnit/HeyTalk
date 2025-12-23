import jwt from "jsonwebtoken";
import User from "../models/User.js"


export const protectRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"unauthorized -No token provied"});
        }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded){
        return res.status(401).json({message:"unauthorized -Invaid token"});
    }
    const user=await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(401).json({message:"unauthorized -User not found"});
    }
    req.user=user;
    next()
    } catch (error) {
        console.log("error in password middleware",error);
        res.status(500).json({message:"Internal Server Eroror"});
    }
}