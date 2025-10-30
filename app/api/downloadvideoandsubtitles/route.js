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


        debugger;
        if (!idvideovimeo) {
            return Response.json({ error: "Missing idvideovimeo parameter" }, { status: 400 });
        }

        // 1. Obtener info del video desde Vimeo
        const videoData = await clientVimeoGff.request({
            method: "GET",
            path: `/videos/${idvideovimeo}`
        });

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

        // 4. Buscar subtítulos
        const textTracks = videoData.body.texttracks || [];
        let subtitleBuffers = [];
        for (const track of textTracks) {
            if (track.link) {
                const subRes = await fetch(track.link);
                const subBuf = await subRes.buffer();
                subtitleBuffers.push({
                    filename: `subtitle_${track.language || 'unknown'}.vtt`,
                    buffer: subBuf
                });
            }
        }

        // 5. Crear el zip
        const zip = new JSZip();
        zip.file("movie.mp4", videoBuffer);
        subtitleBuffers.forEach(sub => {
            zip.file(sub.filename, sub.buffer);
        });
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        // 6. Responder con el zip
        return new Response(zipBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": "attachment; filename=movie_and_subtitles.zip"
            }
        });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
