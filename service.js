const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Service name is required"], trim: true },
    category: { type: String, required: true, enum: ["plumber", "electrician", "mechanic", "housekeeping", "other"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    duration: { type: String, default: "1-2 hours" },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);