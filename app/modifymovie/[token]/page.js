import { verifyToken } from "@/lib/validateToken";
import React from "react";
import prisma from "@/lib/prisma";
import { DownloadIcon } from "lucide-react";

async function fetchData(token) {
  //Primero que exista el token
  if (!token) {
    return { error: "Invalid token" };
  } else {
    //Si existe valido que el token sea válido.
    let resultado = await verifyToken(token);

    if (resultado == null) {
      return { error: "Invalid Token" };
    }

    const resultQuery = await prisma.$queryRaw`
    SELECT * FROM catalogo
    WHERE submission_id = ${parseInt(resultado.submission_id)}
    AND JSON_EXTRACT(detalle, '$.Email') = ${resultado.email}
    AND status = 1
  `;

    if (resultQuery.length === 0) {
      return { error: "Not valid data, try again" };
    }

    return { data: resultQuery[0] };
  }
}

const ModifyMovieScreenComponent = async ({ params }) => {
  //Tomamos el valor del token que tenemos dentro
  const { token } = params;
  //Mandamos la función de validación
  const data = await fetchData(token); // Este fetch se ejecutará en el servidor

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fondoLogin">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Your Certificate
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Congratulations on participate in our festival! Download your
          certificate by clicking the button below.
        </p>
        <button
          onClick={null}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default ModifyMovieScreenComponent;
