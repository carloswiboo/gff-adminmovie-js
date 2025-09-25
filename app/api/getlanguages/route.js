import { NextResponse } from "next/server";

export async function GET() {
  // Import dynamically to avoid issues with SSR/client
  const { Vimeo } = await import("@vimeo/vimeo");
  const client = new Vimeo(
    process.env.VIMEO_CLIENT_ID,
    process.env.VIMEO_CLIENT_SECRET,
    process.env.VIMEO_ACCESS_TOKEN
  );

  return new Promise((resolve) => {
    client.request(
      {
        path: "/languages",
        query: { filter: "texttracks" }
      },
      (error, body) => {
        if (error) {
          resolve(
            NextResponse.json({ error: error.message || "Vimeo API error" }, { status: 500 })
          );
        } else {
          resolve(
            NextResponse.json({ data: body }, { status: 200 })
          );
        }
      }
    );
  });
}
