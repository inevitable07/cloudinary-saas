"use client";
import React,{useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function VideoUpload() {
    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const[title,setTitle] = useState("");
    const[description,setDescription] = useState("");
    const [uploading,setUploading] = useState(false);


    //handle file size
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!videoFile) {
            alert("Please select a video file to upload.");
            return;
        }
        if(videoFile.size > MAX_FILE_SIZE){
            //to add notification
            alert("File size exceeds the 100MB limit.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("originalSize", videoFile.size.toString());

        try {
            const response = await axios.post("/api/video-upload", 
                formData,{
                  maxBodyLength: Infinity,
                  maxContentLength: Infinity,
                });

            if(response.status == 200){

            }
            console.log("Upload response:", response.data);
            router.push("/");
        } catch (error) {
            console.error("Upload error:", error);
            //To add notification
        }finally{
            setUploading(false);
        }
    }

    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      );
}
export default VideoUpload;