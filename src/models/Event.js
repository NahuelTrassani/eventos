import mongoose from "mongoose";
import "./User.js";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "cancelled", "finished"],
      default: "draft",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
