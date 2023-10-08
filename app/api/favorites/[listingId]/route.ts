import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import User from "@/models/User";
import { Types } from "mongoose";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser: any = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const user = await User.findOneAndUpdate(
    { _id: currentUser._id },
    { favoriteIds: favoriteIds },
    {
      new: true,
    }
  );

  return NextResponse.json(user);
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
  console.log("listingID: " + typeof listingId);

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];
  const listingIdObj = new Types.ObjectId(listingId);

  favoriteIds = favoriteIds.filter((id) => id != listingId);

  const user = await User.findOneAndUpdate(
    { _id: currentUser._id },
    { favoriteIds: favoriteIds },
    {
      new: true,
    }
  );

  return NextResponse.json(user);
}
