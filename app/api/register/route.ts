import { create } from "zustand";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await connectMongoDB();
  console.log(name + email + hashedPassword);

  const user = await User.findOne({ email }).select("_id");
  if (user) {
    console.log("exists");
    return NextResponse.json({ massage: "user already exists" });
  }
  try {
    //const newuse = new User({ name, email, hashedPassword });
    await User.create({ name, email, hashedPassword });

    await User.updateMany(
      {},
      { $set: { updatedAt: new Date(), createdAt: new Date() } },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      }
    );

    return NextResponse.json({ massage: "user registered" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { massage: "an error occured while registeration" },
      { status: 500 }
    );
  }
}
