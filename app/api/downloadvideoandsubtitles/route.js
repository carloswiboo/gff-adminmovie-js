import { verifyToken } from "@/lib/createToken";
import prisma from "@/lib/prisma";
import clientVimeoGff from '@/app/helpers/VimeoCreatorHelper';
import JSZip from "jszip";
import fetch from "node-fetch";

export const revalidate = 0;

export async function GET(request) {
    try {
        // Obtener idvideovimeo desde query params
        const { searchParams } = new URL(request.url);
        const idvideovimeo = searchParams.get("idvideovimeo");

        if (!idvideovimeo) {
            return Response.json({ error: "Missing idvideovimeo parameter" }, { status: 400 });
        }

        // 1. Obtener info del video desde Vimeo
        const videoData = await clientVimeoGff.request({
            method: "GET",
            path: `/videos/${idvideovimeo}`
        });



        // Obtener y sanitizar el nombre de la película
        let movieName = (videoData.body && videoData.body.name) ? videoData.body.name : "movie";
        movieName = movieName.replace(/[^a-zA-Z0-9_\-\.]/g, "_"); // reemplaza caracteres inválidos

        // 2. Buscar el archivo de video descargable
        let bestFile = videoData.body.files.find(f => f.rendition === "1080p");
        if (!bestFile) {
            bestFile = videoData.body.files.find(f => f.rendition === "720p");
        }
        if (!bestFile) {
            bestFile = videoData.body.files.length > 0 ? videoData.body.files[0] : null;
        }

        if (!bestFile) {
            return Response.json({ error: "No downloadable video found" }, { status: 404 });
        }

        // 3. Descargar el archivo de video
        const videoResponse = await fetch(bestFile.link);
        const videoBuffer = await videoResponse.buffer();

        // 4. Obtener subtítulos (pueden no estar en videoData.body => llamar al endpoint /texttracks)
        let textTracks = (videoData.body && (videoData.body.texttracks || videoData.body.text_tracks)) || [];
        if (!textTracks || textTracks.length === 0) {
            try {
                const tracksRes = await clientVimeoGff.request({
                    method: "GET",
                    path: `/videos/${idvideovimeo}/texttracks`
                });
                // tracksRes.body.data suele contener el array de tracks
                textTracks = (tracksRes.body && (tracksRes.body.data || tracksRes.body)) || [];
            } catch (err) {
                // Si falla, continuar sin subtítulos
                textTracks = [];
            }
        }

        let subtitleBuffers = [];
        for (const track of textTracks) {
            // diferentes campos que puede traer Vimeo para el link
            const trackLink = track.link || track.download || track.uri || track.link_url || null;
            if (!trackLink) continue;

            try {
                const subRes = await fetch(trackLink);
                if (!subRes.ok) continue;
                const subBuf = await subRes.buffer();

                // elegir extensión/idioma de forma segura
                const format = (track.format || "").toString().toLowerCase();
                const ext = format === "vtt" || format === "webvtt" ? "vtt" : (format === "srt" ? "srt" : "vtt");
                const lang = track.language || track.lang || track.locale || 'unknown';

                subtitleBuffers.push({
                    filename: `subtitle_${lang}.${ext}`,
                    buffer: subBuf
                });
            } catch (err) {
                // ignore individual subtitle errors
                continue;
            }
        }

        // 5. Crear el zip con el nombre de la película
        const zip = new JSZip();
        zip.file(`${movieName}.mp4`, videoBuffer);
        subtitleBuffers.forEach(sub => {
            zip.file(sub.filename, sub.buffer);
        });
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // 6. Responder con el zip usando el nombre de la película
        return new Response(zipBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=${movieName}_and_subtitles.zip`
            }
        });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
