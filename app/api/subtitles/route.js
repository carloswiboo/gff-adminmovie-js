
// app/api/vimeo/subtitles/route.js
import { NextResponse } from "next/server";
import { Vimeo } from "@vimeo/vimeo";

function vimeoClient() {
    const { VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, VIMEO_TOKEN } = process.env;
    if (!VIMEO_CLIENT_ID || !VIMEO_CLIENT_SECRET || !VIMEO_TOKEN) {
        throw new Error("Faltan variables de entorno de Vimeo (CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN).");
    }
    return new Vimeo(VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, VIMEO_TOKEN);
}
const vreq = (client, args) =>
    new Promise((resolve, reject) => client.request(args, (err, body, sc, headers) => err ? reject(err) : resolve({ body, sc, headers })));

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        if (!videoId) return NextResponse.json({ error: "Falta videoId" }, { status: 400 });

        const client = vimeoClient();
        const { body } = await vreq(client, {
            method: "GET",
            path: `/videos/${videoId}/texttracks`
        });
        // body.data = array de tracks
        return NextResponse.json({ ok: true, data: body?.data ?? [], raw: body });
    } catch (e) {
        return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const form = await request.formData();
        const videoId = form.get("videoId");
        const language = form.get("language") || "es";
        const type = form.get("type") || "subtitles";
        const name = form.get("name") || "Español";
        const file = form.get("file");
        if (!videoId) return NextResponse.json({ error: "Falta videoId" }, { status: 400 });
        if (!file) return NextResponse.json({ error: "Falta archivo .vtt o .srt" }, { status: 400 });

        const filename = file.name?.toLowerCase() || "subtitles.vtt";
        const isVtt = filename.endsWith(".vtt");
        const isSrt = filename.endsWith(".srt");
        if (!isVtt && !isSrt) return NextResponse.json({ error: "Usa .vtt o .srt" }, { status: 415 });
        const mime = isVtt ? "text/vtt" : "application/x-subrip";
        const buf = Buffer.from(await file.arrayBuffer());

        const client = vimeoClient();
        // 1) crear texttrack
        const { body: track } = await vreq(client, {
            method: "POST",
            path: `/videos/${videoId}/texttracks`,
            query: { type, language, name, active: false } // lo activamos luego si quieres
        });

        const uploadLink = track?.link || track?.upload_link;
        if (!uploadLink) return NextResponse.json({ error: "No se recibió upload_link", track }, { status: 502 });

        // 2) subir archivo al upload_link (PUT)
        const putRes = await fetch(uploadLink, {
            method: "PUT",
            headers: { "Content-Type": mime, "Content-Length": String(buf.length) },
            body: buf
        });
        if (!putRes.ok) {
            const t = await putRes.text().catch(() => "");
            return NextResponse.json({ error: "Fallo subida de subtítulos", status: putRes.status, body: t }, { status: 502 });
        }

        return NextResponse.json({ ok: true, message: "Subtítulo subido", track_uri: track?.uri, track });
    } catch (e) {
        return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const payload = await req.json();
        const { videoId, texttrackId, active, defaultTrack, name, language } = payload || {};
        if (!videoId || !texttrackId) return NextResponse.json({ error: "Faltan videoId y/o texttrackId" }, { status: 400 });

        const client = vimeoClient();
        const query = {};
        if (typeof active === "boolean") query.active = active;
        if (typeof defaultTrack === "boolean") query.default = defaultTrack; // establecer como default
        if (name) query.name = name;
        if (language) query.language = language;

        const { body } = await vreq(client, {
            method: "PATCH",
            path: `/videos/${videoId}/texttracks/${texttrackId}`,
            query
        });

        return NextResponse.json({ ok: true, body });
    } catch (e) {
        return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const texttrackId = searchParams.get("texttrackId");
        if (!videoId || !texttrackId) return NextResponse.json({ error: "Faltan videoId y/o texttrackId" }, { status: 400 });

        const client = vimeoClient();
        await vreq(client, { method: "DELETE", path: `/videos/${videoId}/texttracks/${texttrackId}` });

        return NextResponse.json({ ok: true, message: "Text track eliminado" });
    } catch (e) {
        return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
    }
}