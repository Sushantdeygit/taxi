import multer from "multer";
import path from "path"; // To handle file paths
import fs from "fs"; // To check and create directories

// Ensure the upload directory exists
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Set the upload directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to avoid conflicts
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
  }
  cb(null, true);
};

// Define maximum file size (e.g., 2 MB)
const maxSize = 2 * 1024 * 1024; // 2 MB

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});
