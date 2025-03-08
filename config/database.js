import mongoose from "mongoose";
import "dotenv/config"



console.log("MONGO_URI:", process.env.DB_URL);

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Mongo Db Connected');
        
    } catch (error) {
        console.log('Error Connecting MongoDB, ',error);
        
    }
}


export default connectDB ;



// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;
  
//   try {
//     await mongoose.connect(process.env.dbUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     isConnected = true;
//     console.log("MongoDB Connected!");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//   }
// };

// export default connectDB ;
