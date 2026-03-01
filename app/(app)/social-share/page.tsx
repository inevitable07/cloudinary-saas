"use client"
import React,{useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats ={
   "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
   "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
   "Instagram Landscape (1.91:1)": { width: 1080, height: 566, aspectRatio: "191:100" },
   "Twitter (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
   "Facebook (1.91:1)": { width: 1200, height: 630, aspectRatio: "191:100" },
   "LinkedIn (1.91:1)": { width: 1200, height: 627, aspectRatio: "191:100" },
   "Pinterest (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
   "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
}

type socialFormatKey = keyof typeof socialFormats;

export default function SocialShare() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<socialFormatKey>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if(uploadedImage  && selectedFormat) {
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
  };

  const handleDownload = () =>{

    const img = imageRef.current?.querySelector("img");
    if(!img) return;

    fetch(img.src)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedFormat.replace(/\s/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
      
  }


  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>

      <div className="card">
        <div className="card-body">

          <h2 className="card-title mb-4">Upload a image</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Choose an image to upload and transform for social media sharing.
              </span>
            </label>

            <input 
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered w-full" 
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary progress w-full" />
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">

              <h3 className="text-xl font-semibold mb-4">
                Select Social Media Format
              </h3>

              <div className="form-control">
                <select 
                  className="select select-bordered w-full"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as socialFormatKey)}
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 relative">

                <h3 className="text-lg font-semibold mb-2">Preview</h3>

                <div className="flex justify-center"
                    ref={imageRef}>

                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}

                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed Image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    quality= "auto"
                    format= "auto"
                    onLoad={() => setIsTransforming(false)}
                  />

                </div>
              </div>

              <div className="card-actions mt-6 flex justify-center">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download Image
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
