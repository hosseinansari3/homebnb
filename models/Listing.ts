import mongoose, { Schema } from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    imageSrc: String,

    createdAt: { type: Date, default: Date.now },
    category: String,
    roomCount: Number,
    bathroomCount: Number,
    guestCount: Number,
    locationLabel: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservations",
      },
    ],
    price: Number,
  },
  { timestamps: true, strict: false }
);

const Listing =
  mongoose.models.Listings || mongoose.model("Listings", listingSchema);
export default Listing;
