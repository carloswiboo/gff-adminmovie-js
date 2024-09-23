import { verifyToken } from "@/lib/createToken";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function POST(request, { params }) {
  
  try {
    let body = await request.json();
    let { tokendata, mostrarStreaming, paisesStreaming, submission_id } = body;

    if (!tokendata || !mostrarStreaming || !paisesStreaming || !submission_id) {
      throw new Error(
        "Missing required parameters: tokendata, mostrarStreaming, or paisesStreaming or submission_id"
      );
    }
    const token = await verifyToken(tokendata);

    if (!token) {
      return Response.json({ error: "Invalid Token" }, { status: 401 });
    }
    // Ajusto el valor de mostrarStreaming
    body.paisesStreaming = JSON.stringify(paisesStreaming);

    delete body.tokendata;
    body.mostrarStreaming = parseInt(mostrarStreaming);

    const result = await prisma.catalogo.update({
      where: {
        submission_id: parseInt(submission_id),
      },
      data: {
        paisesStreaming: body.paisesStreaming, // No need to stringify, Prisma handles it
        mostrarStreaming: body.mostrarStreaming,
        update_date: new Date(),
      },
    });

    return Response.json(result === null ? [] : result, { status: 200 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
