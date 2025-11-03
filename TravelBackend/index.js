import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"

dotenv.config()

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// Enable CORS for frontend (Replace with your frontend URL)
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173"
app.use(cors({
    origin: allowedOrigin, // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow CRUD operations
    credentials: true, // Allow cookies & authorization headers
  })
)

app.use(cookieParser())

// for allowing json object in req body
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Debug middleware to log requests (optional - comment out in production)
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body).substring(0, 200))
  }
  next()
})

// server static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/assets", express.static(path.join(__dirname, "assets")))

// API Routes (MUST be before error handler)
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// Error handler middleware (MUST be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  console.error("Error:", {
    statusCode,
    message,
    path: req.path,
    method: req.method
  })

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`\n✅ Server is running on port ${PORT}!`)
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🔗 MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`)
  console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}\n`)
})
