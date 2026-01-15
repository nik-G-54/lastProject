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


const app = express()// this is used to connect express in backend

dotenv.config()  // by this we connect .envfile {dotenv.config()}
// from here we add group chat ......................................
import { createServer } from 'node:http';

import { Server } from 'socket.io';
import ChatMessage from "./models/chatMessage.model.js"



const server = createServer(app);// it will create a HTTP server request

const io = new Server(server, {
    cors: {
        origin: '*',
    }, 
});

const ROOM = 'group';

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('joinRoom', async (userName) => {
        console.log(`${userName} is joining the group.`);

        await socket.join(ROOM);

        // send to all
        // io.to(ROOM).emit('roomNotice', userName);

        // broadcast
        socket.to(ROOM).emit('roomNotice', userName);
    });

    socket.on('requestHistory', async () => {
        try {
            const lastMessages = await ChatMessage.find({})
              .sort({ createdAt: -1 })
              .limit(100)
              .lean();

            // send in chronological order
            socket.emit('history', lastMessages.reverse());
        } catch (e) {
            console.error('Failed to fetch chat history', e);
        }
    });

    socket.on('chatMessage', async (msg) => {
        try {
            const doc = await ChatMessage.create({
                sender: msg.sender,
                text: msg.text || '',
                imageUrl: msg.imageUrl || ''
            });
            const saved = {
                id: doc._id.toString(),
                sender: doc.sender,
                text: doc.text,
                imageUrl: doc.imageUrl,
                ts: doc.createdAt.getTime(),
            };
            // echo to others in room
            socket.to(ROOM).emit('chatMessage', saved);
            // optionally confirm back to sender with normalized payload
            socket.emit('chatAck', saved);
        } catch (e) {
            console.error('Failed to save chat message', e);
        }
    });

    socket.on('typing', (userName) => {
        socket.to(ROOM).emit('typing', userName);
    });

    socket.on('stopTyping', (userName) => {
        socket.to(ROOM).emit('stopTyping', userName);
    });
});


mongoose.connect(process.env.MONGO_URI) // by this line we ad mongo with the backend mongo.connect("here we paste the Url of mongo db")
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

// // Enable CORS for frontend(s)
// const allowedOrigins = [
//   process.env.FRONTEND_ORIGIN,
//   "http://localhost:5173",
//   "http://localhost:4173",
//   "https://travelstoryf.onrender.com"
// ].filter(Boolean)

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like mobile apps, curl, Postman)
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true)
//     }
//     return callback(new Error("Not allowed by CORS"))
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }))
const allowedOrigins = [
  "https://travelstoryf.onrender.com", // deployed frontend
  "http://localhost:5173",
  "http://localhost:4173"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`🚫 Blocked by CORS: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));


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
// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`\n✅ Server is running on port ${PORT}!`)
//   console.log(`📡 API endpoints available at http://localhost:${PORT}/api`)
//   console.log(`🔗 MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`)
//   console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}\n`)
// })
const PORT = process.env.PORT || 4600;
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
});