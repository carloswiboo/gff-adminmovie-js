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

      await new Promise((resolve, reject) => {
        try {
          const upload = new Upload(file, {
            uploadUrl: meta.uploadLink,
            retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
            metadata: { filename: file.name, filetype: file.type },
            onError: (err) => {
              console.error('tus onError:', err);
              reject(err);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              // Calculate percentage directly - avoid division by zero
              const calculatedProgress = bytesTotal > 0 ? Math.round((bytesUploaded / bytesTotal) * 100) : 0;
              console.log('Progress:', calculatedProgress, '% -', bytesUploaded, 'of', bytesTotal, 'bytes');
              // Update state directly with the calculated value
              setVideoProgress(calculatedProgress);
              toast.success(`Upload progress: ${calculatedProgress}%`);
            },
            onSuccess: () => {
              console.log('tus onSuccess');
              toast.success("Upload complete!");
              window.location.reload();
              resolve();
            }
          });

          // Start the upload
          upload.start();
        } catch (startErr) {
          console.error('Error starting tus upload:', startErr);
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
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-indigo-800">Upload video to Vimeo</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload your video directly to Vimeo using TUS. Select a file and click Upload Button bellow.
        </p>

        {/* Si ya existe un video en Vimeo, solo muestra el aviso y nada más */}
        {(props.finaldata?.movie?.response_vimeo || props.finalData?.movie?.response_vimeo) ? (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm font-semibold flex items-center justify-between">
            <span>Ya existe un video en Vimeo para esta película.</span>
            <button
              className="ml-4 px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              onClick={async () => {
                const videoUri =
                  props.finaldata?.movie?.response_vimeo?.uri ||
                  props.finalData?.movie?.response_vimeo?.uri;
                if (!videoUri) {
                  toast.error("No se encontró el URI del video para eliminar.");
                  return;
                }
                if (!window.confirm("¿Seguro que deseas eliminar el video de Vimeo?")) return;
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
                    toast.success("Video eliminado correctamente.");
                    if (props.onDelete) props.onDelete(result);
                  } else {
                    toast.error(result.error || "Error al eliminar el video.");
                  }
                } catch (err) {
                  toast.error("Error de red al eliminar el video.");
                }
              }}
              type="button"
            >
              Eliminar video
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                ref={fileVideoRef}
                type="file"
                accept="video/*"
                className="block w-full sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0 file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <button
                onClick={handleUploadVideo}
                disabled={videoStatus === "uploading"}
                className={`py-2 px-4 rounded-md text-white font-medium transition ${videoStatus === "uploading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                {videoStatus === "uploading" ? "Uploading..." : "Upload"}
              </button>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-indigo-600 transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* visible semantic progress element (accessible) */}
              <div className="flex items-center justify-between mt-2 gap-3">
                <progress
                  className="w-full h-2"
                  value={videoProgress}
                  max="100"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={videoProgress}
                />
                <div className="w-16 text-right text-xs font-medium text-gray-700">
                  {videoProgress}%
                </div>
              </div>

              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-600">
                  {videoStatus === "uploading"
                    ? `Uploading… ${videoProgress}%`
                    : videoStatus === "done"
                      ? "Completed"
                      : "Waiting"}
                </span>
                {videoUri && (
                  <a
                    href={videoUri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View video
                  </a>
                )}
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
