import { verifyToken } from "@/lib/validateToken";
import prisma from "@/lib/prisma";
import { createCanvas, loadImage } from "canvas";

export const revalidate = 0;
export async function GET(request, { params }) {
  try {
    const { tokendata } = params;

    const token = await verifyToken(tokendata);

    const resultQuery = await prisma.$queryRaw`
    SELECT * FROM catalogo
    WHERE submission_id = ${parseInt(token.submission_id)}
    AND JSON_EXTRACT(detalle, '$.Email') = ${token.email}
    AND status = 1
  `;

    return Response.json(resultQuery);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
