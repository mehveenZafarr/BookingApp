import mongoose from "mongoose";

const connectMongoDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in connecting Mongo: ${error}`);
        process.exit(1)
    }
}

export default connectMongoDb;