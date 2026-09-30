import dotenv from "dotenv"

dotenv.config()

export const port = process.env.PORT || 5000

export const mongoUri = process.env.MONGODB_URI

export const jwt_secret = process.env.JWT_SECRET