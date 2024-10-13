import { verifyToken } from "@/lib/createToken";
import prisma from "@/lib/prisma";

export const revalidate = 0;
export async function GET(request, { params }) {
  try {
    const { tokendata } = params;

    const token = await verifyToken(tokendata);

    const resultQuery = await prisma.$queryRaw`
    SELECT * FROM catalogo
    WHERE JSON_EXTRACT(detalle, '$."Tracking Number"') = ${token.submission_id}
    AND JSON_EXTRACT(detalle, '$.Email') = ${token.email}
    AND status = 1
    LIMIT 1
  `;

    const resultQueryDOS = await prisma.$queryRaw`
SELECT * FROM ediciones
WHERE idedicion = ${parseInt(resultQuery[0].idedicion)}
AND status = 1
LIMIT 1
`;

    let finalData = {
      movie: { ...resultQuery[0] },
      edition: { ...resultQueryDOS[0] },
    };

    return Response.json(finalData);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
