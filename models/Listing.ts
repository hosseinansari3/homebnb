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
    locationValue: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: Number,
  },
  { timestamps: true }
);

const Listing =
  mongoose.models.Listings || mongoose.model("Listings", listingSchema);
export default Listing;
