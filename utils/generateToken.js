import jwt from "jsonwebtoken"
import "dotenv/config"


const secretKey = process.env.secretKey ;

export const userToken = (user) => {

    return jwt.sign({data:user.email, role:user.role},secretKey,{expiresIn:'1d'});

}