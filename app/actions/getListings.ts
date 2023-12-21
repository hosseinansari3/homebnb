import Listing from "@/models/Listing";
import { formatISO } from "date-fns";
import { AnyArray } from "mongoose";
import { json } from "stream/consumers";

export interface IListingsParams {
  user?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: any;
  endDate?: any;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      user,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (user) {
      query.user = user;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        $gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        $gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        $gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    /*
    if (startDate && endDate) {
      const parsedStartDate = new Date("2023-10-23T20:30:00.000+00:00"); // Decode URL-encoded date string
      const parsedEndDate = new Date("2023-10-24T20:30:00.000+00:00"); // Decode URL-encoded date string

      query.reservations = {
        $elemMatch: {
          $or: [
            {
              startDate: parsedStartDate,
            },
            {
              endDate: parsedEndDate,
            },
          ],
        },
      };
    }
*/

    /*
    const listings = await Listing.find(query)
      .populate({
        path: "reservations",
        match:
          endDate && startDate
            ? {
                $not: {
                  $or: [
                    {
                      $and: [
                        { endDate: { $gte: new Date(startDate) } },
                        { startDate: { $lte: new Date(startDate) } },
                      ],
                    },
                    {
                      $and: [
                        { startDate: { $lte: new Date(endDate) } },
                        { endDate: { $gte: new Date(endDate) } },
                      ],
                    },
                  ],
                },
              }
            : {},
      })
      .lean()
      .exec()
      .then((listings) => {
        listings = listings?.filter((listing) => {
          return listing?.reservations.length != 0;
        });
        return listings;
      });
      */

    const listings = await Listing.aggregate([
      {
        $match: query, // Add your initial query conditions here
      },
      {
        $lookup: {
          from: "reservations", // Replace with the actual name of your reservations collection
          localField: "reservations", // Replace with the field that connects reservations to listings
          foreignField: "_id", // Replace with the field that connects reservations to listings
          as: "reservations",
        },
      },
      {
        $match: {
          $or: [
            {
              reservations: {
                $not: {
                  $elemMatch: {
                    $or: [
                      {
                        $and: [
                          { endDate: { $gte: new Date(startDate) } },
                          { startDate: { $lte: new Date(startDate) } },
                        ],
                      },
                      {
                        $and: [
                          { startDate: { $lte: new Date(endDate) } },
                          { endDate: { $gte: new Date(endDate) } },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              reservations: { $size: 0 }, // Include listings with no reservations
            },
          ],
        },
      },
    ]);

    return listings;
  } catch (error: any) {
    throw new Error(error);
  }
}
