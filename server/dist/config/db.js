import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "career-lens"
        });
        console.log("connected to mongodb");
    }
    catch (error) {
        console.log("error connecting to mongodb", error);
    }
};
export default connectDB;
