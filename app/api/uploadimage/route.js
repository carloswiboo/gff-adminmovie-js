import { NextResponse } from "next/server";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const form = formidable({ multiples: true });

  // Convierte el `request` de Next.js en un `Buffer` para que `formidable` pueda procesarlo
  const buffer = await request.arrayBuffer();
  const req = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  }).getReader();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(
          NextResponse.json(
            { message: "Error parsing the file" },
            { status: 500 }
          )
        );
        return;
      }

      const imageFile = files.image;
      const formData = new FormData();
      formData.append(
        "file",
        fs.createReadStream(imageFile.filepath),
        imageFile.originalFilename
      );
      formData.append("title", "Imagen subida desde Next.js");
      formData.append("status", "publish");

      const username = process.env.WP_USERNAME;
      const appPassword = process.env.WP_APP_PASSWORD;
      const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

      try {
        const response = await fetch(
          "https://gironafilmfestival.com/wp-json/wp/v2/media",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error uploading image: ${response.statusText}`);
        }

        const data = await response.json();
        resolve(
          NextResponse.json(
            { message: "Image uploaded successfully", data },
            { status: 200 }
          )
        );
      } catch (error) {
        resolve(NextResponse.json({ message: error.message }, { status: 500 }));
      }
    });
  });
}
