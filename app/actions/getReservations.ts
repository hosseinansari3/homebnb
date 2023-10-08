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
    query.listing = { userId: authorId };
  }

  try {
    const reservations = await Reservation.find(query)
      .populate("userId")
      .populate("listingId")
      .lean();

    if (!reservations) {
      return null;
    }

    return reservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
