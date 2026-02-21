import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import {auth} from '@clerk/nextjs/server';
import { prisma } from "@/lib/prisma";




// prisma.$connect().catch((error) => {
//     console.error("Prisma connection error:", error);
//     process.exit(1); 
// });

 // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
        api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    interface cloudinaryUploadResult {
        public_id: string;
        bytes: number;
        duration?: number;
        [key: string]: any;
    }

export async function POST(request: NextRequest) {
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    

    try {
        if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
        )
        {
        return NextResponse.json({error: "Cloudinary configuration missing"}, {status: 500});
        }
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const originalSize = formData.get('originalSize') as string;

        if(!file) {
            return NextResponse.json({error: "No file found"}, {status: 400});
        }

        // Parse the entire video file into a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log(`Processing video file: ${file.name}, Size: ${buffer.length} bytes`);

        const result = await new Promise<cloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
               {
                resource_type: "video",
                folder: "nextjs-videos-uploads",
                timeout: 600000,
                transformation: [
                    {
                        quality: "auto",
                        fetch_format: "mp4"
                    }
                ]
            },
               (error, result) => {
                   if(error) {
                       reject(error);
                   } else {
                       resolve(result as cloudinaryUploadResult);
                   }
            })
            uploadStream.end(buffer);
        })
        
        const videoData = await prisma.video.create({
            data: {
                title: title,
                description: description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            }
        })
        return NextResponse.json(videoData, {status: 200});
    } catch (error) {
        console.log("Video Upload error:", error);
        return NextResponse.json({error: "Upload failed"}, {status: 500});
        
    }
}
