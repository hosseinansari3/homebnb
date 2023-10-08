import Listing from "@/models/Listing";
import Reservation from "@/models/Reservation";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser: any = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  try {
    const newReservation = new Reservation({
      userId: currentUser._id,
      startDate,
      endDate,
      totalPrice,
      listingId,
    });

    const reservation = await newReservation.save();

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $push: { reservations: reservation._id } },
      { new: true } // To get the updated Listing document
    );

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.log(error);
  }
}
