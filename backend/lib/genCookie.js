import jwt from "jsonwebtoken";
import { jwt_secret } from "./config";

export default genrateTokensetCookie=async(userId,res)=>{
    const token = jwt.sign({userId},jwt_secret,{
        expiresIn:"15d"
    })

    res.cookeie('jwt',token,{
        maxAge: 15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
    })
}