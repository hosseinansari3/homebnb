import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/models/Listing";

export async function POST(request: Request) {
  const currentUser: any = await getCurrentUser();
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const imageFile = formData.get("imageFile");
  const roomCount = Number(formData.get("roomCount"));
  const bathroomCount = Number(formData.get("bathroomCount"));
  const price = formData.get("price");
  const guestCount = Number(formData.get("guestCount"));
  const location = JSON.parse(formData.get("location"));
  const category = formData.get("category");

  console.log("formData", location);

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!imageFile) {
    return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const filename = Date.now() + imageFile.name.replaceAll(" ", "_");

  await writeFile(
    path.join(process.cwd(), "public/uploads/" + filename),
    buffer
  );

  const listing = new Listing({
    title,
    description,
    category,
    roomCount,
    imageSrc: "http://localhost:3000/uploads/" + filename,
    bathroomCount,
    reservations: [],
    guestCount,
    locationValue: location.label,
    price: parseInt(price, 10),
    user: currentUser._id,
  });

  const savedListing = await listing.save();

  return NextResponse.json({});
}
