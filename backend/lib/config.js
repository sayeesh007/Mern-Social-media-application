import dotenv from "dotenv"

dotenv.config()

export const port = process.env.PORT || 5000

export const mongoUri = process.env.MONGODB_URI

export const jwt_secret = process.env.JWT_SECRET

export const cloud_name = process.env.CLOUD_NAME
export const api_key = process.env.API_KEY
export const api_secrete = process.env.API_SECRETE