import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Reservation from "@/models/Reservation";
import { Types } from "mongoose";
import Listing from "@/models/Listing";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
  }

  const reservation = await Reservation.deleteOne({
    _id: reservationId,
  });

  await Listing.updateOne(
    { reservations: { $in: [reservationId] } },
    {
      $pull: { reservations: reservationId },
    }
  ).catch((err) => console.log(err));

  return NextResponse.json(reservation);
}
