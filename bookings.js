const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;