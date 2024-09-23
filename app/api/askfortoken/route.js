export const revalidate = 0;
import { Resend } from "resend";
import handlebars from "handlebars";
import { mailTemplate } from "@/handlebars/mailTemplate";
import { createToken } from "@/lib/createToken";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, submission_id } = body;

    if (!email || !submission_id) {
      return Response.json(
        { error: "Email and submission_id are required" },
        { status: 400 }
      );
    }

    const resultQuery = await prisma.$queryRaw`
    SELECT * FROM catalogo
    WHERE submission_id = ${parseInt(submission_id)}
    AND JSON_EXTRACT(detalle, '$.Email') = ${email}
    AND status = 1
  `;

    if (resultQuery.length === 0) {
      return Response.json(
        { error: "Not valid data, try again" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}/`;

    const template = handlebars.compile(mailTemplate());

    let hola = await createToken({
      email: resultQuery[0].detalle.Email,
      submission_id: submission_id,
    });

    const html = template({
      title: "Here is your url!",
      content: `${resultQuery[0].detalle["Project Title"]} With this url you can edit your movie streaming and download your certificate`,
      link: baseUrl + "editmovie/" + hola,
      buttonLink: "Edit your movie streaming and download your certificate",
    });

    let result = await resend.emails.send({
      from: "Girona Film Festival <notifications@gironafilmfestival.com>",
      to: [
        "director@gironafilmfestival.com",
        "carlos@gironafilmfestival.com",
        resultQuery[0].detalle.Email,
      ],
      subject: "Movie Administration - Here is your access link",
      html: html,
    });

    return Response.json(hola);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
