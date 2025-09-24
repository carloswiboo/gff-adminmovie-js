"use client";

import { Download } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { axiosAPIGet } from "@/lib/api/APIGet";
import { useRouter } from "next/navigation";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Head from "next/head";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import LoadingScreenComponent from "@/app/components/LoadingScreenComponent/LoadingScreenComponent";
import { Autocomplete, Button, TextField } from "@mui/material";
import { axiosAPIPost } from "@/lib/api/APIPost";
import ChangePhotoComponent from "@/app/components/ChangePhotoComponent/ChangePhotoComponent";
import AceptTermsAndConditionsComponent from "@/app/components/AceptTermsAndConditionsComponent/AceptTermsAndConditionsComponent";
import UploadImageToWordpressComponent from "@/app/components/UploadImageToWordpressComponent/UploadImageToWordpressComponent";
import toast from "react-hot-toast";
import DarkModeToggle from "@/app/components/DarkModeToggle/DarkModeToggle";

export default function Component({ params }) {
  const certificateRef = useRef(null);
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [finalData, setFinalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalTerms, setModalTerms] = useState(false);
  const [dataPaises, setDataPaises] = React.useState([]);
  const [dataPaisesSeleccionados, setDataPaisesSeleccionados] = React.useState(
    []
  );
  const [streamingStatus, setStreamingStatus] = React.useState("");
  // derived state: enable download only when judging status is not 'undecided'
  const judgingStatusRaw = finalData?.movie?.detalle?.["Judging Status"];
  const isDownloadEnabled = judgingStatusRaw && String(judgingStatusRaw).toLowerCase() !== "undecided";
  React.useEffect(() => {
    setLoading(true);
    axiosAPIGet(
      "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
    ).then((response) => {
      if (response.status !== 200) {
        setDataPaises([]);
        return;
      }
      setLoading(true);
      setDataPaises(response.data);
    });
  }, []);

  const handleDownloadPDF = async () => {
    // Guard: do nothing if download not enabled
    if (!isDownloadEnabled) {
      toast.error(
        "Certificate download is disabled until the judging decision is available."
      );
      return;
    }

    try {
      setLoading(true);
      const element = certificateRef.current;
      // Make sure element is rendered and visible for html2canvas
      element.style.display = "block";
      // Scroll into view so remote fonts/images have a better chance to load
      if (element.scrollIntoView) {
        element.scrollIntoView({ behavior: "auto", block: "center" });
      }

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false
      });
      element.style.display = "none";
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1056, 816]
      });
      pdf.addImage(imgData, "PNG", 0, 0, 1056, 816);
      pdf.save("certificado.pdf");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while generating the certificate PDF.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    axiosAPIGet("/api/getinformationmovie/" + params.token).then((response) => {
      if (response.status !== 200) {
        router.push("/");
        setLoading(false);
      } else {
        let arreglo = response.data.movie.paisesStreaming;

        if (arreglo == null || dataPaises.length == 0) {
          setDataPaisesSeleccionados([]);
          setLoading(false);
          setFinalData(response.data);
          return;
        }
        setStreamingStatus(response.data.movie.mostrarStreaming);

        arreglo = JSON.parse(arreglo);

        let arregloFinal = [];

        for (const paisIncluido of arreglo) {
          let resultadoPaisEncontrado = dataPaises.find(
            (pais) => pais.cca2 == paisIncluido
          );

          arregloFinal.push(resultadoPaisEncontrado);
        }

        setDataPaisesSeleccionados(arregloFinal);

        setLoading(false);
        setFinalData(response.data);
      }
    });
    setToken(token);
  }, [dataPaises]);

  return (
    <>
      <Head>
        <title>
          {finalData?.movie?.detalle["Project Title"] || "Movie Information"} -
          Streaming Management
        </title>
        <meta
          name="description"
          content="Edit movie streaming information and geolocation"
        />
      </Head>
      {loading && <LoadingScreenComponent />}



      <div className="min-h-screen bg-zinc-100 dark:bg-gray-950 flex justify-center py-6 px-4 sm:px-6 lg:px-8  items-center">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
              <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 text-red-600">
                <MovieCreationIcon className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 " />{" "}
                Your Movie Information
              </h1>
              <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
                Edit movie streaming information and geolocation.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="streaming-status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Streaming Status
                  </label>
                  <select
                    id="streaming-status"
                    name="streaming-status"
                    value={streamingStatus}
                    onChange={(e) => {
                      if (e.target.value == 1) {
                        setModalTerms(true);
                      }
                      debugger;
                      setStreamingStatus(e.target.value);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Button
                      variant="text"
                      onClick={() => {
                        setDataPaisesSeleccionados(dataPaises);
                      }}
                      className="text-xs sm:text-sm"
                    >
                      Select all countries
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        setDataPaisesSeleccionados([]);
                      }}
                      className="text-xs sm:text-sm"
                    >
                      Remove all countries
                    </Button>
                  </div>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    value={dataPaisesSeleccionados}
                    options={dataPaises}
                    getOptionLabel={(option) =>
                      option.cca2 + " - " + option.name.common
                    }
                    onChange={(evento, valor) => {
                      setDataPaisesSeleccionados(valor);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Select the countries where the movie will be available"
                        placeholder="Countries"
                      />
                    )}
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    if (streamingStatus == "") {
                      toast.error("Please select a streaming status");
                      return;
                    }

                    setLoading(true);

                    let finalArreglo = {
                      paisesStreaming: dataPaisesSeleccionados.map(
                        (pais) => pais.cca2
                      ),
                      mostrarStreaming: streamingStatus,
                      tokendata: params.token,
                      submission_id: finalData?.movie?.submission_id
                    };

                    axiosAPIPost(
                      "/api/savemovieconfiguration",
                      {},
                      finalArreglo
                    ).then((resultado) => {
                      debugger;
                      if (resultado.status !== 200) {
                        setLoading(false);
                        return;
                      }
                      window.location.reload();
                      setLoading(false);
                    });
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out"
                >
                  <MovieCreationIcon className="mr-2 h-5 w-5" />
                  Save Movie Configuration
                </button>
              </div>

              <UploadImageToWordpressComponent
                finalData={finalData}
                setLoading={setLoading}
                tokendata={params.token}
              />
            </div>
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <img
                  src="https://www.gironafilmfestival.com/wp-content/uploads/2022/08/logo-girona-film-festival.png"
                  className="w-full"
                  alt="Girona Film Festival Logo"
                />
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-yellow-600">
                  <WorkspacePremiumIcon className="w-5 h-5 sm:w-6 sm:h-6 inline-block mr-2" />{" "}
                  Your Certificate
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
                  Download your certificate as PDF.
                </p>
                <button
                  onClick={handleDownloadPDF}
                  disabled={!isDownloadEnabled}
                  title={
                    isDownloadEnabled
                      ? "Download certificate as PDF"
                      : "Download disabled until the judging decision is available"
                  }
                  className={
                    "w-full font-bold py-2 px-4 rounded flex items-center justify-center transition duration-300 ease-in-out " +
                    (isDownloadEnabled
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed")
                  }
                >
                  <Download className="mr-2 h-5 w-5" />
                  {isDownloadEnabled ? "Download Certificate" : "Download (disabled)"}
                </button>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-yellow-600">
                  Your movie data
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
                  <small>Movie Name</small> <br />
                  <strong> {finalData?.movie?.detalle["Project Title"]}</strong>
                </p>

                <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
                  <small>Judging Status</small> <br />
                  <strong>
                    {" "}
                    {finalData?.movie?.detalle["Judging Status"]}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={certificateRef}
        style={{
          display: "none",
          width: "1056px",
          height: "816px",
          position: "relative",
          backgroundImage: "url('/templatediploma.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px"
        }}
      >
        <h1
          style={{
            position: "absolute",
            top: "450px",
            left: "300px",
            right: "300px",
            fontSize: "30px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#ffcc66",
            textTransform: "uppercase"
          }}
        >
          <span style={{ fontSize: "36px" }}>
            {finalData?.movie?.detalle["Judging Status"]}
          </span>
          <br />
          <span>{finalData?.movie?.detalle["Submission Categories"]}</span>
        </h1>
        <h1
          style={{
            position: "absolute",
            top: "600px",
            left: "300px",
            right: "300px",
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#7a3700",
            textTransform: "uppercase"
          }}
        >
          <span>{finalData?.movie?.detalle["Project Title"]}</span>
          <span>
            {finalData?.movie?.detalle["Project Title (Original Language)"] && (
              <>
                <br />
                <span style={{ fontSize: "18px" }}>
                  {" "}
                  {
                    finalData?.movie?.detalle[
                    "Project Title (Original Language)"
                    ]
                  }
                </span>
              </>
            )}
          </span>
          <br />
          <span style={{ fontSize: "14px" }}>
            {finalData?.movie?.detalle["Directors"]}{" "}
          </span>
        </h1>
        <h1
          style={{
            position: "absolute",
            top: "710px",
            left: "300px",
            right: "220px",
            fontSize: "12px",
            textAlign: "right",
            fontWeight: "",
            color: "#ffcc66",
            textTransform: "uppercase"
          }}
        >
          GFF {finalData?.edition?.nombre} - {finalData?.edition?.anio}
        </h1>
      </div>

      <AceptTermsAndConditionsComponent
        modalTerms={modalTerms}
        setModalTerms={setModalTerms}
        finalData={finalData}
        setStreamingStatus={setStreamingStatus}
      />
    </>
  );
}
