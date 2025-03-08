import multer from "multer";

// Configure Multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
  limits: { fileSize: 200 * 1024 * 1024 }, // Limit file size to 5 MB
});




export default upload;