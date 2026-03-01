import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


// const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try {
        const videos = await prisma.video.findMany({
            where: { userId },
            orderBy :{createdAt : "desc"}
        });
        return NextResponse.json(videos);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const video = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description,
        publicId: body.publicId,
        originalSize: body.originalSize,
        compressedSize: body.compressedSize,
        duration: body.duration,
        userId,
      },
    });

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}