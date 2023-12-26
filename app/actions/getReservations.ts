"use server";
import { Types } from "mongoose";
import Reservation from "@/models/Reservation";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams) {
  const { listingId, userId, authorId } = params;

  const query: any = {};

  if (listingId) {
    query.listingId = new Types.ObjectId(listingId);
  }

  if (userId) {
    query.userId = userId;
  }

  if (authorId) {
    query.listings = { $elemMatch: { author: authorId } };
  }

  try {
    const reservations = await Reservation.aggregate([
      {
        $lookup: {
          from: "listings", // Replace with the actual name of your reservations collection
          localField: "listingId", // Replace with the field that connects reservations to listings
          foreignField: "_id", // Replace with the field that connects reservations to listings
          as: "listings",
        },
      },
      {
        $match: {
          ...query,
        },
      },
    ]);

    if (!reservations) {
      return null;
    }

    return reservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
