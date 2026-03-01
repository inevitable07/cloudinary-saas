import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
){
  const { id } = await context.params;

  // find video
  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // delete cloudinary
  const result = await cloudinary.uploader.destroy(video.publicId, {
    resource_type: "video",
  });
  console.log("Cloudinary delete result:", result);

  // delete DB
  await prisma.video.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}