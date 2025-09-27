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
        const { filename, size, name, description, privacy, tokendata } = bodyReq || {};

        if (!Number.isFinite(size) || size <= 0) {
            return NextResponse.json({ error: 'Missing/invalid file size' }, { status: 400 });
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
                // Use MySQL JSON_EXTRACT + JSON_UNQUOTE to compare the JSON field
                const rows = await prisma.$queryRaw`
                  SELECT * FROM catalogo
                  WHERE JSON_UNQUOTE(JSON_EXTRACT(detalle, '$."Tracking Number"')) = ${String(submissionId)}
                  AND status = 1
                `;

                catalogMatches = Array.isArray(rows) ? rows : [];
            } catch (dbErr) {
                console.error('Database query error for catalog lookup:', dbErr);
                // proceed without failing the whole flow; catalogMatches stays empty
            }
        } else {
            console.warn('DATABASE_URL not set; skipping catalog lookup.');
        }
        // --- end catalog lookup ---

        // derive video name and description: prefer explicit `name`/`description`,
        // otherwise try catalog project's "Project Title" and "Synopsis", then filename
        let videoName = name || filename || 'Untitled';
        let videoDescription = description || '';
        if (((!name || name === '') || (!description || description === '')) && Array.isArray(catalogMatches) && catalogMatches.length > 0) {
            try {
                const first = catalogMatches[0];
                const detalleObj = typeof first.detalle === 'object' ? first.detalle : JSON.parse(first.detalle);
                const projectTitle = (detalleObj?.["Project Title"] ?? detalleObj?.project_title ?? null) + ' - ' + submissionId;
                const synopsis = detalleObj?.["Synopsis"] ?? detalleObj?.synopsis ?? detalleObj?.["Short Synopsis"] ?? null;

                if ((!name || name === '') && projectTitle && String(projectTitle).trim() !== '') {
                    videoName = String(projectTitle).trim();
                }
                if ((!description || description === '') && synopsis && String(synopsis).trim() !== '') {
                    videoDescription = String(synopsis).trim();
                }
            } catch (e) {
                // ignore parse errors and keep fallback values
            }
        }

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

        const result = await new Promise((resolve, reject) => {
            clientVimeoGff.request(
                {
                    method: 'POST',
                    path: '/me/videos',
                    query: {
                        name: videoName,
                        description: videoDescription || '',
                        privacy: { view: privacy || 'unlisted' },
                        upload: {
                            approach: 'tus',
                            size
                        }
                    }
                },
                (err, body) => {
                    if (err) return reject(err);
                    resolve(body);
                }
            );
        });

        console.log('Vimeo upload response:', result);
        console.log('Associated tokenInfo:', tokenInfo);
        console.log('Catalog matches:', catalogMatches.length);

        // If Vimeo returned a result, update the catalogo.response_vimeo for the matched submission
        if (result && Array.isArray(catalogMatches) && catalogMatches.length > 0) {
            try {
                const firstRow = catalogMatches[0];
                // try to get submission id from common places
                let rowSubmissionId = firstRow.submission_id ?? firstRow.submissionId ?? null;
                if (!rowSubmissionId && firstRow.detalle) {
                    try {
                        const detalleObj = typeof firstRow.detalle === 'object' ? firstRow.detalle : JSON.parse(firstRow.detalle);
                        rowSubmissionId = detalleObj?.submission_id ?? detalleObj?.submissionId ?? detalleObj?.["Tracking Number"] ?? null;
                    } catch (e) {
                        // ignore parse error
                    }
                }

                if (rowSubmissionId) {
                    // store full Vimeo response as JSON string in response_vimeo column
                    const responseJson = JSON.stringify(result);
                    await prisma.$executeRaw`
                    UPDATE catalogo
                    SET response_vimeo = ${responseJson}, videoAutorizado = 0
                    WHERE submission_id = ${(rowSubmissionId)}
                      AND status = 1
                  `;
                    console.log('Updated catalogo.response_vimeo for submission_id:', rowSubmissionId);
                } else {
                    console.warn('Could not determine submission_id from catalogMatches[0]; skipping update.');
                }
            } catch (dbUpdateErr) {
                console.error('Error updating catalogo.response_vimeo:', dbUpdateErr);
            }
        }

        return NextResponse.json(
            {
                uploadLink: result?.upload?.upload_link,
                videoUri: result?.uri,
                tokendata: tokendata ?? null,
                tokenInfo,
                catalogMatches // array of matching catalog rows (may be empty)
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Upload video handler error:', err);
        const errorMessage = err?.error || 'Error uploading to Vimeo';
        const developer_message = err?.developer_message || err?.message || null;
        const error_code = err?.error_code || null;
        const status = err?.statusCode || 500;

        return NextResponse.json(
            { error: errorMessage, developer_message, error_code },
            { status }
        );
    }
}
