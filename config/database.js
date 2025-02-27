import mongoose from "mongoose";
import "dotenv/config";


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.dbUrl);
        console.log('Mongo Db Connected');
        
    } catch (error) {
        console.log('Error Connecting MongoDB, ',error);
        
    }
}


export default connectDB ;