"use client"
import React,{useState, useEffect, useRef, use} from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats ={
   "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
   "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
   "Instagram Landscape (1.91:1)": { width: 1080, height: 566, aspectRatio: "1.91:1" },
   "Twitter (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
   "Facebook (1.91:1)": { width: 1200, height: 630, aspectRatio: "1.91:1" },
   "LinkedIn (1.91:1)": { width: 1200, height: 627, aspectRatio: "1.91:1" },
   "Pinterest (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
   "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
}

type socialFormatKey = keyof typeof socialFormats;

export default function socialShare() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<socialFormatKey>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);



  useEffect(() => {
    if(uploadedImage) {
        setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if(!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      })
      if(!response.ok) {
        throw new Error("Image Upload failed");
      }
      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed. Please try again.");
    }finally{
      setIsUploading(false);
    }
  }

  return (
    <div>Social-share</div>
  )
}
