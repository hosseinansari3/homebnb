import Listing from "@/models/Listing";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser: any = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await Listing.find({
      _id: {
        $in: [...(currentUser.favoriteIds || [])],
      },
    });

    return favorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
