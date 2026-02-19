import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy :{createdAt : "desc"}
        });
        return NextResponse.json(videos);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }finally {  
            await prisma.$disconnect();
    }
}