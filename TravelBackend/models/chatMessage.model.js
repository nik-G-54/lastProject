import mongoose from "mongoose"

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema)

export default ChatMessage




