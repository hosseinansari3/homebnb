import Listing from "@/models/Listing";
export default async function getListings() {
  try {
    const listings = Listing.find();

    return listings;
  } catch (error) {
    throw new Error(error);
  }
}
