import { verifyToken } from "@/lib/createToken";

export const revalidate = 0;
export async function GET(request, { params }) {
  try {
    const { tokendata } = params;

    const token = await verifyToken(tokendata);

    return Response.json(token);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
