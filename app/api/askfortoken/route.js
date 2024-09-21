export const revalidate = 0;
import { Resend } from "resend";
import handlebars from "handlebars";
import { mailTemplate } from "@/handlebars/mailTemplate";
import { createToken } from "@/lib/createToken";

export async function POST(request, { params }) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, submission_id } = body;

    debugger;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}/`;

    const template = handlebars.compile(mailTemplate());

    let hola = await createToken({
      email: "carlos@prueba.com",
      submission_id: "123465789",
    });

    const html = template({
      title: "Hey you!",
      content: `${baseUrl}`,
      link: baseUrl + "editmovie/" + hola,
      buttonLink: "Edit your movie streaming and download your certificate",
    });

    let result = await resend.emails.send({
      from: "Girona Film Festival <notifications@gironafilmfestival.com>",
      to: ["carlosestrada122@gmail.com"],
      subject: "Movie Administration - Here is your access link",
      html: html,
    });

    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
