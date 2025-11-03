import multer from "multer"

// Use memory storage to stream directly to Cloudinary
// Instead of saving to disk first
const storage = multer.memoryStorage()

// file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only images are allowed"), false)
  }
}

// Initialize multer instance with memory storage
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
})

export default upload
