import mongoose, { Schema } from "mongoose";

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageSrc: String,
  createdAt: { type: Date, default: Date.now },
  category: String,
  roomCount: Number,
  bathroomCount: Number,
  guestCount: Number,
  locationValue: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: Number,
});

const Listing =
  mongoose.models.listings || mongoose.model("Listings", listingSchema);
export default Listing;
