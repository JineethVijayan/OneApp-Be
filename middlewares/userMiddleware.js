import jwt from "jsonwebtoken";
import "dotenv/config";

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get Authorization header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

    if (!token) {
        console.log("token",token)
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.secretKey); // Verify token
        console.log("decoded",decoded);
        req.user = decoded; // Attach user info to request
        console.log(req.user.role);

    if(req.user.role !=='user'){
        return res.status(403).json({message:'Unauthorized'})
    }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

