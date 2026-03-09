const Booking = require("../models/Booking");
const Service = require("../models/Service");

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, timeSlot, address, phone, notes } = req.body;
    if (!serviceId || !bookingDate || !timeSlot || !address || !phone)
      return res.status(400).json({ success: false, message: "All required fields must be filled" });

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      bookingDate,
      timeSlot,
      address,
      phone,
      notes,
      totalPrice: service.price,
    });
    const populated = await booking.populate("service", "name category price");
    res.status(201).json({ success: true, message: "Booking confirmed!", data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name category price imageUrl")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service", "name category price")
      .populate("user", "name email phone");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });
    if (booking.status === "completed")
      return res.status(400).json({ success: false, message: "Cannot cancel a completed booking" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ success: true, message: "Booking cancelled", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("service", "name category")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Status updated", data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking, getAllBookings, updateBookingStatus };