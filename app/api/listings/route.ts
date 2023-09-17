import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/models/Listing";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = new Listing({
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    locationValue: location.value,
    price: parseInt(price, 10),
    userId: currentUser.id,
  });

  const savedListing = await listing.save();

  return NextResponse.json(listing);
}
