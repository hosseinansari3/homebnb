import mongoose, { Schema } from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

const Reservation =
  mongoose.models.reservations ||
  mongoose.model("Reservations", reservationSchema);
export default Reservation;
