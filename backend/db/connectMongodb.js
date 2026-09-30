import mongoose from "mongoose";
import { mongoUri } from "../lib/config.js";

const connectMongoDB = async () => {
	try {
		const conn = await mongoose.connect(mongoUri);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
};

export default connectMongoDB;