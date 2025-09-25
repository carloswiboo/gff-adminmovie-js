import clientVimeoGff from '@/app/helpers/VimeoCreatorHelper';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export async function POST(request) {
    try {
        const bodyReq = await request.json();
        // accept tokendata so frontend can send the current user/submission token
        const { videoUri, tokendata } = bodyReq || {};

        if (!videoUri) {
            return NextResponse.json({ error: 'Missing videoUri' }, { status: 400 });
        }

        // --- token validation (existing code) ---
        let tokenInfo = null;
        if (!tokendata) {
            return NextResponse.json({ error: 'Missing tokendata' }, { status: 400 });
        }

        const isJwt = String(tokendata).split('.').length === 3;
        if (isJwt) {
            const secret = process.env.JWT_KEY;
            if (!secret) {
                return NextResponse.json({ error: 'Server configuration error: Missing TOKEN_JWT_SECRET' }, { status: 500 });
            }
            try {
                const { payload } = await jwtVerify(tokendata, new TextEncoder().encode(secret));
                tokenInfo = payload;
            } catch (e) {
                console.error('JWT verification failed:', e);
                return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
            }
        } else {
            // Opaque token: placeholder for server-side validation (DB, cache or auth service)
            return NextResponse.json({ error: 'Opaque token validation not implemented' }, { status: 401 });
        }
        // --- end token validation ---

        // derive submission id from token payload (try common keys)
        const submissionId = tokenInfo?.submission_id ?? tokenInfo?.sub ?? tokenInfo?.submissionId ?? null;

        // If submissionId is missing, respond with a clear error
        if (!submissionId) {
            return NextResponse.json({ error: 'Token does not contain submission identifier' }, { status: 400 });
        }

        // --- NEW: query catalogs table where catalogo JSON has submission_id === submissionId and status = 1 ---
        let catalogMatches = [];
        if (process.env.DATABASE_URL) {
            try {
                const rows = await prisma.$queryRaw`
                  SELECT * FROM catalogo
                  WHERE JSON_UNQUOTE(JSON_EXTRACT(detalle, '$."Tracking Number"')) = ${String(submissionId)}
                  AND status = 1
                `;
                catalogMatches = Array.isArray(rows) ? rows : [];
            } catch (dbErr) {
                console.error('Database query error for catalog lookup:', dbErr);
            }
        } else {
            console.warn('DATABASE_URL not set; skipping catalog lookup.');
        }
        // --- end catalog lookup ---

        if (!process.env.VIMEO_CLIENT_ID || !process.env.VIMEO_CLIENT_SECRET || !process.env.VIMEO_TOKEN) {
            console.error('Missing Vimeo credentials. Please check your environment variables.');
            return NextResponse.json(
                {
                    error: 'Server configuration error: Missing Vimeo credentials',
                    developer_message: 'Please set VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, and VIMEO_TOKEN in your environment variables.'
                },
                { status: 500 }
            );
        }

        // --- ELIMINAR VIDEO EN VIMEO ---
        let deleteResult = null;
        try {
            await new Promise((resolve, reject) => {
                clientVimeoGff.request(
                    {
                        method: 'DELETE',
                        path: videoUri
                    },
                    (err, body, statusCode, headers) => {
                        if (err) return reject(err);
                        resolve({ body, statusCode, headers });
                    }
                );
            });
            deleteResult = { success: true };
        } catch (err) {
            console.error('Error deleting video from Vimeo:', err);
            return NextResponse.json({ error: 'Error deleting video from Vimeo', developer_message: err?.message }, { status: 500 });
        }

        // --- LIMPIAR response_vimeo EN LA BASE DE DATOS ---
        if (Array.isArray(catalogMatches) && catalogMatches.length > 0) {
            try {
                const firstRow = catalogMatches[0];
                let rowSubmissionId = firstRow.submission_id ?? firstRow.submissionId ?? null;
                if (!rowSubmissionId && firstRow.detalle) {
                    try {
                        const detalleObj = typeof firstRow.detalle === 'object' ? firstRow.detalle : JSON.parse(firstRow.detalle);
                        rowSubmissionId = detalleObj?.submission_id ?? detalleObj?.submissionId ?? detalleObj?.["Tracking Number"] ?? null;
                    } catch (e) { }
                }
                if (rowSubmissionId) {
                    await prisma.$executeRaw`
                        UPDATE catalogo
                        SET response_vimeo = NULL
                        WHERE submission_id = ${(rowSubmissionId)}
                          AND status = 1
                    `;
                }
            } catch (dbUpdateErr) {
                console.error('Error clearing catalogo.response_vimeo:', dbUpdateErr);
            }
        }

        return NextResponse.json(
            {
                success: true,
                deleted: true,
                videoUri,
                tokendata: tokendata ?? null,
                tokenInfo,
                catalogMatches
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Delete video handler error:', err);
        const errorMessage = err?.error || 'Error deleting video from Vimeo';
        const developer_message = err?.developer_message || err?.message || null;
        const error_code = err?.error_code || null;
        const status = err?.statusCode || 500;

        return NextResponse.json(
            { error: errorMessage, developer_message, error_code },
            { status }
        );
    }
}