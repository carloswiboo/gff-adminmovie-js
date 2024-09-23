"use client";
import { DownloadIcon } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { axiosAPIGet } from "@/lib/api/APIGet";
import { useRouter } from "next/navigation";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Head from "next/head";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
const ModifyMovieScreenComponent = ({ params }) => {
  const certificateRef = useRef(null);

  const router = useRouter();

  const [token, setToken] = useState(null);
  const [finalData, setFinalData] = useState({});

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;

    // Mostrar el elemento temporalmente para capturarlo
    element.style.display = "block";

    // Usa html2canvas para capturar el elemento referenciado
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: false,
    });

    // Volver a ocultar el elemento después de la captura
    element.style.display = "none";

    // Obtener la imagen del canvas en formato PNG
    const imgData = canvas.toDataURL("image/png");

    // Crear un documento PDF usando jsPDF
    const pdf = new jsPDF({
      orientation: "landscape", // Apaisado
      unit: "px", // Unidades en píxeles
      format: [1056, 816], // Tamaño carta en píxeles (8.5 x 11 pulgadas a 96dpi)
    });

    // Agregar la imagen al documento PDF
    pdf.addImage(imgData, "PNG", 0, 0, 1056, 816);

    // Descargar el archivo PDF
    pdf.save("certificado.pdf");
  };

  useEffect(() => {
    // Asegurarse de que el router está listo y el componente está montado antes de acceder a router.query
    axiosAPIGet("/api/getinformationmovie/" + params.token).then((response) => {
      if (response.status !== 200) {
        // Manejar error
        // router.push("/");
      } else {
        setFinalData(response.data);
      }
    });

    setToken(token);
  }, []);

  return (
    <>
      <Head>
        <title>
          {" "}
          Download your certificate and admin your streaming information
        </title>
      </Head>
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fondoLogin gap-3">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          {/* Elemento que queremos capturar */}
          <h1 className="text-2xl font-bold text-center mb-4">
            <WorkspacePremiumIcon style={{ color: "#ca8a28" }} /> Your
            Certificate
          </h1>

          <p className="text-gray-600 text-center mb-6">
            Download your certificate as PDF by clicking the button below.
          </p>
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Certificate
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          {/* Elemento que queremos capturar */}
          <h1 className="text-2xl font-bold text-center mb-4">
            <MovieCreationIcon style={{ color: "#ca8a28" }} /> Your Movie
            Information
          </h1>

          <p className="text-gray-600 text-center mb-6">
            Edit movie streaming information, geolocation, and activation.
          </p>
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
          >
            <MovieCreationIcon className="mr-2 h-4 w-4" />
            Configure yout movie now!
          </button>
        </div>
      </div>

      <div
        ref={certificateRef}
        style={{
          display: "none", // Ocultar el contenido completamente hasta que se descargue
          width: "1056px", // 8.5 pulgadas * 96 píxeles/pulgada
          height: "816px", // 11 pulgadas * 96 píxeles/pulgada
          position: "relative", // Para posicionar texto sobre la imagen
          backgroundImage: "url('/templatediploma.png')", // Imagen de fondo
          backgroundSize: "cover", // Para ajustar la imagen al tamaño del documento
          backgroundPosition: "center", // Centrar la imagen
          padding: "20px", // Un poco de padding para que el texto no esté pegado a los bordes
        }}
      >
        {/* Texto sobre la imagen */}
        <h1
          style={{
            position: "absolute",
            top: "450px", // Ajusta la posición superior
            left: "300px", // Ajusta la posición izquierda
            right: "300px", // Ajusta la posición izquierda
            fontSize: "32px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#ffcc66",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontSize: "30px" }}>
            {" "}
            {finalData?.movie?.detalle["Judging Status"]}{" "}
          </span>
          <br />
          {finalData?.movie?.detalle["Submission Categories"]}
        </h1>

        <h1
          style={{
            position: "absolute",
            top: "600px", // Ajusta la posición superior
            left: "300px", // Ajusta la posición izquierda
            right: "300px", // Ajusta la posición izquierda
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#7a3700",
            textTransform: "uppercase",
          }}
        >
          {finalData?.movie?.detalle["Project Title"]}
          {finalData?.movie?.detalle["Project Title (Original Language)"] ==
          "" ? (
            <>
              <br />
              {finalData?.movie?.detalle["Project Title (Original Language)"]}
            </>
          ) : (
            <>
              <br />
              {finalData?.movie?.detalle["Project Title (Original Language)"]}
            </>
          )}
          <br />
          {finalData?.movie?.detalle["Directors"]}
        </h1>

        <h1
          style={{
            position: "absolute",
            top: "710px", // Ajusta la posición superior
            left: "300px", // Ajusta la posición izquierda
            right: "220px", // Ajusta la posición izquierda
            fontSize: "12px",
            textAlign: "right",
            fontWeight: "",
            color: "#ffcc66",
            textTransform: "uppercase",
          }}
        >
          GFF {finalData?.edition?.nombre} - {finalData?.edition?.anio}
        </h1>
      </div>
    </>
  );
};

export default ModifyMovieScreenComponent;
