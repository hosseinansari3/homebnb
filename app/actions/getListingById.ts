import Listing from "@/models/Listing";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await Listing.findOne({ _id: listingId }).populate("user");

    if (!listing) {
      return null;
    }

    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
