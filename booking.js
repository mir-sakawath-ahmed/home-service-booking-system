const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    bookingDate: { type: Date, required: [true, "Booking date is required"] },
    timeSlot: { type: String, required: true, enum: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"] },
    address: { type: String, required: [true, "Service address is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"], default: "pending" },
    totalPrice: { type: Number },
    confirmationCode: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode = "HS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);