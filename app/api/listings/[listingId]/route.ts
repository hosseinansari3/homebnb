import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/models/Listing";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser: any = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const listing = await Listing.deleteOne({
    _id: listingId,
    user: currentUser._id,
  });

  return NextResponse.json(listing);
}
