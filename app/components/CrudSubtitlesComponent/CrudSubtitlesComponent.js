"use client";

import { useEffect, useState } from "react";

export default function CrudSubtitlesComponent(props) {




  const [videoId, setVideoId] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState("es");
  const [name, setName] = useState("Español");
  const [type, setType] = useState("subtitles"); // subtitles|captions|...
  const [languages, setLanguages] = useState([]);
  const [languagesLoading, setLanguagesLoading] = useState(true);

  // Nuevo estado para saber si se está actualizando un track específico
  const [updatingTrackId, setUpdatingTrackId] = useState(null);

  // Cargar idiomas desde la API al montar el componente
  useEffect(() => {
    setLanguagesLoading(true);
    fetch("/api/getlanguages")
      .then(res => res.json())
      .then(data => {
        // data.data?.data?.languages o data.data?.languages según tu API

        const langs = data?.data?.data || [];


        setLanguages(langs);
        setLanguagesLoading(false);
      })
      .catch(() => {
        setLanguages([]);
        setLanguagesLoading(false);
      });
  }, []);

  async function load() {
    if (!videoId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/subtitles?videoId=${encodeURIComponent(videoId)}`);
      const json = await res.json();
      if (res.ok) setTracks(json.data || []);
      else alert(json.error || "Error loading tracks");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let holis = props?.finalData?.movie?.response_vimeo?.uri?.split("/")?.pop() || "";
    setVideoId(holis);
  }, [
    props?.finalData?.movie?.response_vimeo
  ]);

  // Auto-load tracks when videoId changes and is not empty
  useEffect(() => {
    if (videoId) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  async function toggleActive(track, active) {
    setUpdatingTrackId(track.uri);
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), active })
    });
    const j = await res.json();
    setUpdatingTrackId(null);
    if (!res.ok) return alert(j.error || "Error changing active state");
    load();
  }

  async function setDefault(track) {
    setUpdatingTrackId(track.uri);
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), defaultTrack: true })
    });
    const j = await res.json();
    setUpdatingTrackId(null);
    if (!res.ok) return alert(j.error || "Error setting default");
    load();
  }

  async function saveMeta(track, newName, newLang) {
    setUpdatingTrackId(track.uri);
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), name: newName, language: newLang })
    });
    const j = await res.json();
    setUpdatingTrackId(null);
    if (!res.ok) return alert(j.error || "Error updating metadata");
    load();
  }

  async function remove(track) {
    setUpdatingTrackId(track.uri);
    if (!confirm("Delete this track?")) {
      setUpdatingTrackId(null);
      return;
    }
    const res = await fetch(`/api/subtitles?videoId=${encodeURIComponent(videoId)}&texttrackId=${encodeURIComponent(idFromUri(track.uri))}`, { method: "DELETE" });
    const j = await res.json();
    setUpdatingTrackId(null);
    if (!res.ok) return alert(j.error || "Error deleting track");
    load();
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return alert("Select a .vtt or .srt file");
    const fd = new FormData();
    fd.append("videoId", videoId);
    fd.append("language", lang);
    fd.append("name", name);
    fd.append("type", type);
    fd.append("file", file);
    const res = await fetch("/api/subtitles", { method: "POST", body: fd });
    const j = await res.json();
    if (!res.ok) return alert(j.error || "Error uploading");
    setFile(null);
    load();
  }

  function idFromUri(uri) {
    // uri forma: "/videos/{videoId}/texttracks/{texttrackId}"
    return uri?.split("/")?.pop();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Info message about video processing time */}
      <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-100">
        If you just uploaded your movie, please wait at least 30 minutes before it becomes available.
        You may see a message indicating it has not loaded yet. If after this time it is still unavailable, please contact us.
      </div>
      {/* Notice if there is already a Vimeo video */}
      {props.finaldata?.movie?.response_vimeo && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-sm font-semibold shadow dark:bg-green-900 dark:text-green-100">
          There is already a Vimeo video for this movie.
        </div>
      )}
      {/* Render embed only if there is a video */}
      {props.finalData?.movie?.response_vimeo?.player_embed_url && (
        <div className="mb-6 w-full rounded-lg overflow-hidden shadow dark:bg-gray-900">
          <div
            className="w-full aspect-video"
            style={{ maxWidth: "100%" }}
            dangerouslySetInnerHTML={{
              __html: props.finalData.movie.response_vimeo.embed.html.replace(
                /width="[^"]*"/g,
                'width="100%"'
              ).replace(
                /height="[^"]*"/g,
                'height="100%"'
              )
            }}
          />
        </div>
      )}

      {/* Only show the rest if there is a video */}
      {props.finalData?.movie?.response_vimeo ? (
        <>
          <h1 className="text-2xl font-semibold mb-4 dark:text-white">Manage Subtitles</h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Formulario de subida */}
            <div className="md:w-1/2 w-full">
              <div className="flex flex-col gap-4 mb-6">
                <input
                  className="border rounded-lg p-2 flex-1 !hidden dark:bg-gray-900 dark:text-white dark:border-gray-700"
                  placeholder="Vimeo Video ID (e.g. 123456789)"
                  value={videoId}
                  onChange={e => setVideoId(e.target.value)}
                />
                <button
                  onClick={load}
                  className="px-4 py-2 rounded-lg bg-black text-white font-medium shadow dark:bg-gray-800 dark:text-white"
                  disabled={!videoId || loading}
                >
                  {loading ? "Loading..." : "Load tracks"}
                </button>
              </div>
              <form onSubmit={upload} className="border rounded-2xl p-6 space-y-5 bg-gray-50 shadow dark:bg-gray-900 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium block mb-1 dark:text-white">Language (BCP-47)</label>
                    <select
                      className="border rounded-lg p-2 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      value={lang}
                      onChange={e => setLang(e.target.value)}
                      disabled={languagesLoading}
                    >
                      {languagesLoading && (
                        <option value="">Loading languages...</option>
                      )}
                      {!languagesLoading && languages.length === 0 && (
                        <option value="">No languages</option>
                      )}
                      {!languagesLoading && languages.map(opt => (
                        <option key={opt.code} value={opt.code}>
                          {opt.name || opt.label || opt.code} ({opt.code})
                        </option>
                      ))}
                    </select>
                    {languagesLoading && (
                      <div className="animate-pulse h-4 bg-gray-200 rounded mt-2 w-2/3 dark:bg-gray-800" />
                    )}
                  </div>
                  <div>
                    <label className="font-medium block mb-1 dark:text-white">Type</label>
                    <select className="border rounded-lg p-2 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700" value={type} onChange={e => setType(e.target.value)}>
                      <option value="subtitles">subtitles</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-medium block mb-1 dark:text-white">Visible name</label>
                  <input className="border rounded-lg p-2 w-full dark:bg-gray-900 dark:text-white dark:border-gray-700" value={name} onChange={e => setName(e.target.value)} placeholder="Spanish" />
                </div>

                <div className=" text-xs">
                  We found a solution for those who are having trouble uploading subtitles to their film 🎬 in adminmovie.gironafilmfestival.com
                  <br />
                  The required format is .vtt. You can use the following link to convert your file easily:
                  <br />
                  <a href="https://ebby.co/subtitle-tools/converter/srt-to-vtt" target="_blank" className=" font-bold" rel="noopener noreferrer">👉 https://ebby.co/subtitle-tools/converter/srt-to-vtt</a>
                </div>

                <div>
                  <label className="font-medium block mb-1 dark:text-white">File (.vtt)</label>
                  <input type="file" accept=".vtt" onChange={e => setFile(e.target.files?.[0] || null)} className="dark:text-white" />
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-black text-white font-semibold shadow w-full dark:bg-gray-800 dark:text-white"
                  disabled={!videoId || loading}
                  type="submit"
                >
                  {loading ? "Uploading..." : "Upload subtitle"}
                </button>
              </form>
            </div>
            {/* Lista de tracks */}
            <div className="md:w-1/2 w-full">
              <div className="space-y-4 mt-8 md:mt-0">
                {(loading || languagesLoading) && (
                  <>
                    {[1, 2].map(i => (
                      <div key={i} className="border rounded-2xl p-4 bg-white shadow flex flex-col gap-3 animate-pulse dark:bg-gray-900 dark:border-gray-700">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 dark:bg-gray-800" />
                        <div className="h-3 bg-gray-100 rounded w-1/3 mb-2 dark:bg-gray-800" />
                        <div className="h-8 bg-gray-100 rounded w-full mb-2 dark:bg-gray-800" />
                      </div>
                    ))}
                  </>
                )}
                {!loading && !languagesLoading && tracks.length === 0 && videoId && (
                  <div className="opacity-70 text-center dark:text-white">No tracks for this video.</div>
                )}
                {!loading && !languagesLoading && tracks.map((t) => (
                  <div key={t.uri} className="border rounded-2xl p-4 bg-white shadow flex flex-col gap-3 dark:bg-gray-900 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="font-medium text-lg dark:text-white">{t.name || "(no name)"} <span className="opacity-70 text-base dark:text-gray-300">({t.language})</span></div>
                        <div className="text-sm opacity-70 dark:text-gray-300">type: {t.type} · active: {String(t.active)} · default: {String(t.default)}</div>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          className="px-3 py-1 rounded-lg border font-medium hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                          onClick={() => toggleActive(t, !t.active)}
                          disabled={updatingTrackId === t.uri}
                        >
                          {updatingTrackId === t.uri
                            ? "Updating..."
                            : t.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg border font-medium hover:bg-gray-100 !hidden dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                          onClick={() => setDefault(t)}
                          disabled={updatingTrackId === t.uri}
                        >
                          {updatingTrackId === t.uri
                            ? "Updating..."
                            : "Set as default"}
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg border font-medium text-red-600 hover:bg-red-50 dark:border-gray-700 dark:text-red-400 dark:hover:bg-red-900"
                          onClick={() => remove(t)}
                          disabled={updatingTrackId === t.uri}
                        >
                          {updatingTrackId === t.uri
                            ? "Updating..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <input
                        defaultValue={t.name || ""}
                        className="border rounded-lg p-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                        onBlur={(e) => saveMeta(t, e.target.value, t.language)}
                        placeholder="Visible name"
                        disabled={updatingTrackId === t.uri}
                      />
                      <select
                        defaultValue={t.language || "es"}
                        className="border rounded-lg p-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                        onBlur={e => saveMeta(t, t.name, e.target.value)}
                        disabled={languagesLoading || updatingTrackId === t.uri}
                      >
                        {languagesLoading && (
                          <option value="">Loading languages...</option>
                        )}
                        {!languagesLoading && languages.length === 0 && (
                          <option value="">No languages</option>
                        )}
                        {!languagesLoading && languages.map(opt => (
                          <option key={opt.code} value={opt.code}>
                            {opt.name || opt.label || opt.code} ({opt.code})
                          </option>
                        ))}
                      </select>
                      {languagesLoading && (
                        <div className="animate-pulse h-4 bg-gray-200 rounded mt-2 w-2/3 dark:bg-gray-800" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Mensaje si no hay tracks activos */}
              {!loading && !languagesLoading && tracks.length > 0 && !tracks.some(t => t.active) && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-100">
                  No active subtitles. You must activate at least one to display on the video.
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}