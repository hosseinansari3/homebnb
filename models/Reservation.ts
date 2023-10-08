import mongoose, { Schema } from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listings" },
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Reservation =
  mongoose.models.Reservations ||
  mongoose.model("Reservations", reservationSchema);
export default Reservation;
