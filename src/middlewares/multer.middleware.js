import multer from "multer";

// Set storage engine to memory storage
const storage = multer.memoryStorage();

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
  storage, // Use memory storage
  fileFilter,
  limits: { fileSize: maxSize }, // Limit file size
});
