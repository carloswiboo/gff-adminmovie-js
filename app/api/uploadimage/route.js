import { verifyToken } from "@/lib/createToken";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function POST(request, { params }) {
  try {
    let body = await request.json();
    let { tokendata, urlImage, typeImage, submission_id } = body;

    debugger;

    if (!tokendata || !urlImage || !typeImage || !submission_id) {
      throw new Error(
        "Missing required parameters: tokendata, urlImage, typeImage or submission_id"
      );
    }
    const token = await verifyToken(tokendata);

    if (!token) {
      return Response.json({ error: "Invalid Token" }, { status: 401 });
    }

    const result = await prisma.catalogo.update({
      where: {
        submission_id: parseInt(submission_id),
      },
      data: {
        [typeImage]: urlImage, // No need to stringify, Prisma handles it
        update_date: new Date(),
      },
    });

    return Response.json(result === null ? [] : result, { status: 200 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
