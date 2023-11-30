import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import User from "@/models/User";
import getCurrentUser from "@/app/actions/getCurrentUser";

export const POST = async (req, res) => {
  const currentUser: any = await getCurrentUser();
  const formData = await req.formData();
  console.log("formData", formData);

  const file = formData.get("file");
  const name = formData.get("name");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + file.name.replaceAll(" ", "_");
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/uploads/" + filename),
      buffer
    );

    await User.findByIdAndUpdate(currentUser._id, {
      persianName: name,
      image: "http://localhost:3000/uploads/" + filename,
    });
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
