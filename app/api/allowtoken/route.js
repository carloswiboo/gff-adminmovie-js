export const revalidate = 0;
import { Resend } from "resend";
import handlebars from "handlebars";
import { mailTemplate } from "@/handlebars/mailTemplate";
import { createToken } from "@/lib/createToken";

export async function GET() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const template = handlebars.compile(mailTemplate());

    let hola = await createToken({ email: "carlos@prueba.com" });

    const html = template({
      title: "Hey you!",
      content: `${hola}`,
      link: process.env.FINAL_URL + hola,
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
