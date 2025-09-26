"use client";
import { useState, useRef } from "react";
import { Upload } from "tus-js-client";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function UploadVideoToVimeoComponent(props) {


  const fileVideoRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatus, setVideoStatus] = useState("idle"); // 'idle' | 'uploading' | 'done'
  const [videoUri, setVideoUri] = useState(null);
  const [videoError, setVideoError] = useState("");

  // derive tokendata: prefer prop, otherwise get route param via Next.js useParams
  const params = useParams();
  const tokendata = props?.tokendata ?? (params ? params.token : null);

  async function handleUploadVideo() {
    setVideoError("");
    const file = fileVideoRef.current?.files?.[0];
    if (!file) {
      setVideoError("Please select a file");
      return;
    }

    if (props?.setLoading) props.setLoading(true);

    try {
      const resp = await fetch("/api/uploadvideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size, tokendata: tokendata ?? null })
      });
      const meta = await resp.json();
      if (!resp.ok || !meta?.uploadLink) {
        console.error('Upload creation failed:', meta);
        setVideoError(meta?.error || "Could not create upload on Vimeo");
        if (props?.setLoading) props.setLoading(false);
        return;
      }

      // Prepare state for upload
      setVideoStatus("uploading");
      setVideoProgress(0);
      const toastId = toast.loading("Starting upload...", { id: 'upload-progress', duration: 4000, position: 'top-center' }); // Crear toast único con propiedades

      await new Promise((resolve, reject) => {
        try {
          const upload = new Upload(file, {
            uploadUrl: meta.uploadLink,
            retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
            metadata: { filename: file.name, filetype: file.type },
            onError: (err) => {
              console.error('tus onError:', err);
              toast.error("Upload failed", { id: toastId }); // Actualizar el mismo toast a error
              reject(err);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              // Calculate percentage directly - avoid division by zero
              const calculatedProgress = bytesTotal > 0 ? Math.round((bytesUploaded / bytesTotal) * 100) : 0;
              console.log('Progress:', calculatedProgress, '% -', bytesUploaded, 'of', bytesTotal, 'bytes');
              // Update state directly with the calculated value
              setVideoProgress(calculatedProgress);
              toast.loading(`Upload progress: ${calculatedProgress}%`, { id: toastId }); // Actualizar el mismo toast (no crea nuevo)
            },
            onSuccess: () => {
              console.log('tus onSuccess');
              toast.success("Upload complete!", { id: toastId }); // Cambiar el mismo toast a success
              window.location.reload();
              resolve();
            }
          });

          // Start the upload
          upload.start();
        } catch (startErr) {
          console.error('Error starting tus upload:', startErr);
          toast.error("Error starting upload", { id: toastId }); // Actualizar a error
          reject(startErr);
        }
      });

      setVideoUri(meta.videoUri || null);
      setVideoStatus("done");

      if (props?.onUploadComplete) {
        try {
          props.onUploadComplete(meta);
        } catch (e) {
          // ignore callback errors
        }
      }
      if (props?.setLoading) props.setLoading(false);
    } catch (err) {
      console.error('handleUploadVideo caught error:', err);
      setVideoStatus("idle");
      setVideoError(err?.message || "Error uploading file");
      if (props?.setLoading) props.setLoading(false);
    }
  }


  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-indigo-800">Upload video to our Festival</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload your video directly to Vimeo using TUS. Select a file and click Upload Button bellow.
        </p>

        {/* If a Vimeo video already exists, show notice only */}
        {(props.finaldata?.movie?.response_vimeo || props.finalData?.movie?.response_vimeo) ? (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm font-semibold flex items-center justify-between">
            <span>There is already a video for this movie.</span>
            <button
              className="ml-4 px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              onClick={async () => {
                const videoUri =
                  props.finaldata?.movie?.response_vimeo?.uri ||
                  props.finalData?.movie?.response_vimeo?.uri;
                if (!videoUri) {
                  toast.error("Video URI not found for deletion.");
                  return;
                }
                if (!window.confirm("Are you sure you want to delete the Vimeo video?")) return;
                try {
                  const resp = await fetch("/api/deletevideo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      videoUri,
                      tokendata: props?.tokendata ?? (params ? params.token : null),
                    }),
                  });
                  const result = await resp.json();
                  if (resp.ok && result.success) {
                    toast.success("Video deleted successfully.");
                    window.location.reload();
                    if (props.onDelete) props.onDelete(result);
                  } else {
                    toast.error(result.error || "Error deleting the video.");
                  }
                } catch (err) {
                  toast.error("Network error while deleting the video.");
                }
              }}
              type="button"
            >
              Delete video
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="file-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select video file
                </label>
                <input
                  ref={fileVideoRef}
                  id="file-input"
                  type="file"
                  accept="video/*"
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  aria-describedby="file_input_help"
                />
                <p id="file_input_help" className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  MP4, AVI, MOV or other video formats (MAX. file size depends on Vimeo limits).
                </p>
              </div>
              <div className="flex-none">
                <button
                  onClick={handleUploadVideo}
                  disabled={videoStatus === "uploading"}
                  className={`py-3 px-6 rounded-lg text-white font-medium transition shadow ${videoStatus === "uploading"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  {videoStatus === "uploading" ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-indigo-600 transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>



              {videoError && (
                <p className="mt-2 text-sm text-red-600">{videoError}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
