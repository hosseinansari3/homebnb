import { model } from "mongoose";
import Listing from "@/models/Listing";
import User from "@/models/User";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await Listing.findOne({ _id: listingId })
      .populate({
        path: "author",
        model: "Users",
      })
      .lean();

    if (!listing) {
      throw new Error("ملکی یافت نشد.");
    }

    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
