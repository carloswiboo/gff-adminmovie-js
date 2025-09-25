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

  // Cargar idiomas desde la API al montar el componente
  useEffect(() => {
    fetch("/api/getlanguages")
      .then(res => res.json())
      .then(data => {
        // data.data?.data?.languages o data.data?.languages según tu API

        const langs = data?.data?.data || [];


        setLanguages(langs);
      })
      .catch(() => setLanguages([]));
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
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), active })
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error || "Error changing active state");
    load();
  }

  async function setDefault(track) {
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), defaultTrack: true })
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error || "Error setting default");
    load();
  }

  async function saveMeta(track, newName, newLang) {
    const res = await fetch("/api/subtitles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, texttrackId: idFromUri(track.uri), name: newName, language: newLang })
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error || "Error updating metadata");
    load();
  }

  async function remove(track) {
    if (!confirm("Delete this track?")) return;
    const res = await fetch(`/api/subtitles?videoId=${encodeURIComponent(videoId)}&texttrackId=${encodeURIComponent(idFromUri(track.uri))}`, { method: "DELETE" });
    const j = await res.json();
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
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Notice if there is already a Vimeo video */}
      {props.finaldata?.movie?.response_vimeo && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-sm font-semibold shadow">
          There is already a Vimeo video for this movie.
        </div>
      )}
      {/* Render embed only if there is a video */}
      {props.finalData?.movie?.response_vimeo?.player_embed_url && (
        <div className="mb-6 w-full rounded-lg overflow-hidden shadow">
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
          <h1 className="text-2xl font-semibold mb-2">Manage Subtitles (Vimeo)</h1>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-6">
            <input
              className="border rounded-lg p-2 flex-1"
              placeholder="Vimeo Video ID (e.g. 123456789)"
              value={videoId}
              onChange={e => setVideoId(e.target.value)}
            />
            <button
              onClick={load}
              className="px-4 py-2 rounded-lg bg-black text-white font-medium shadow"
              disabled={!videoId || loading}
            >
              {loading ? "Loading..." : "Load tracks"}
            </button>
          </div>

          {/* Upload new */}
          <form onSubmit={upload} className="border rounded-2xl p-6 space-y-5 bg-gray-50 shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium block mb-1">Language (BCP-47)</label>
                <select
                  className="border rounded-lg p-2 w-full"
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                >
                  {languages.length === 0 && (
                    <option value="">Loading...</option>
                  )}
                  {languages.map(opt => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name || opt.label || opt.code} ({opt.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-medium block mb-1">Type</label>
                <select className="border rounded-lg p-2 w-full" value={type} onChange={e => setType(e.target.value)}>
                  <option value="subtitles">subtitles</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-medium block mb-1">Visible name</label>
              <input className="border rounded-lg p-2 w-full" value={name} onChange={e => setName(e.target.value)} placeholder="Spanish" />
            </div>
            <div>
              <label className="font-medium block mb-1">File (.vtt / .srt)</label>
              <input type="file" accept=".vtt,.srt" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <button className="px-4 py-2 rounded-lg bg-black text-white font-semibold shadow" disabled={!videoId}>Upload subtitle</button>
          </form>

          {/* List and actions */}
          <div className="space-y-4 mt-8">
            {tracks.length === 0 && videoId && !loading && (
              <div className="opacity-70 text-center">No tracks for this video.</div>
            )}
            {tracks.map((t) => (
              <div key={t.uri} className="border rounded-2xl p-4 bg-white shadow flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-medium text-lg">{t.name || "(no name)"} <span className="opacity-70 text-base">({t.language})</span></div>
                    <div className="text-sm opacity-70">type: {t.type} · active: {String(t.active)} · default: {String(t.default)}</div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button className="px-3 py-1 rounded-lg border font-medium hover:bg-gray-100" onClick={() => toggleActive(t, !t.active)}>
                      {t.active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="px-3 py-1 rounded-lg border font-medium hover:bg-gray-100 !hidden" onClick={() => setDefault(t)}>
                      Set as default
                    </button>
                    <button className="px-3 py-1 rounded-lg border font-medium text-red-600 hover:bg-red-50" onClick={() => remove(t)}>
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <input
                    defaultValue={t.name || ""}
                    className="border rounded-lg p-2"
                    onBlur={(e) => saveMeta(t, e.target.value, t.language)}
                    placeholder="Visible name"
                  />
                  <select
                    defaultValue={t.language || "es"}
                    className="border rounded-lg p-2"
                    onBlur={e => saveMeta(t, t.name, e.target.value)}
                  >
                    {languages.length === 0 && (
                      <option value="">Loading...</option>
                    )}
                    {languages.map(opt => {

                      debugger;
                      return (
                        <option key={opt.code} value={opt.code}>
                          {opt.name || opt.label || opt.code} ({opt.code})
                        </option>
                      )
                    }
                    )}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="text-sm opacity-75 mt-8 border-t pt-4">
            TIP: when embedding, you can force a default subtitle with <code>?texttrack=es</code> in the iframe URL.
          </div>
        </>
      ) : null}
    </div>
  );
}