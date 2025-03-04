import express from "express";
import connectDB from "./config/database.js";
import userRouter from "./routes/userRoutes.js";
import cors from 'cors' ;
import "dotenv/config"

const app = express();


app.use(cors({origin:'http://localhost:5173',credentials:true}))

app.use(express.json());
connectDB();

app.use('/api/v1/user',userRouter)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});









app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
