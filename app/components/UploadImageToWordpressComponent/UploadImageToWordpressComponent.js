import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function UploadImageToWordpressComponent(props) {
  const [status, setStatus] = useState("");

  const validationSchema = Yup.object({
    file: Yup.mixed()
      .required("Please select a file")
      .test(
        "fileType",
        "Only JPG or PNG files are allowed",
        (value) =>
          value && (value.type === "image/jpeg" || value.type === "image/png")
      ),
    imageType: Yup.string().required("Please select an image type"),
  });

  const handleSubmit = async (values) => {
    props.setLoading(true);
    const { file, imageType } = values;

    console.log(`Selected image type: ${imageType}`); // For demonstration purposes

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "title",
      props?.finalData?.movie?.detalle?.["Project Title"]
    );

    try {
      const response = await fetch(
        "https://www.gironafilmfestival.com/wp-json/wp/v2/media",
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic " + btoa("dataapp:H8RI NWoz Dc75 NJAD 8YQP Ynjp"),
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        props.setLoading(false);
        setStatus(`File uploaded successfully: ${data.source_url}`);
      } else {
        const errorData = await response.json();
        props.setLoading(false);
        setStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      props.setLoading(false);
      setStatus(`Connection error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <Formik
            initialValues={{ file: null, imageType: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6 bg-white shadow-xl rounded-lg p-6 transition-all duration-300 hover:shadow-2xl">
                <div>
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select a file (JPG or PNG)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors duration-300">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file"
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png"
                            onChange={(event) => {
                              setFieldValue(
                                "file",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imageType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select image type
                  </label>
                  <Field
                    as="select"
                    id="imageType"
                    name="imageType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Choose an image type...</option>
                    <option value="cover">Cover</option>
                    <option value="support">Support</option>
                    <option value="director">Director's Photo</option>
                  </Field>
                  <ErrorMessage
                    name="imageType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Upload
                </button>
              </Form>
            )}
          </Formik>

          {status && (
            <div
              className={`mt-4 p-4 rounded-md ${
                status.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {status}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-white shadow-xl rounded-lg p-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">
              Uploaded Images
            </h2>
            <div className="space-y-4">
              {props?.finalData?.movie?.urlImagenPortada && (
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </h3>
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={props.finalData.movie.urlImagenPortada}
                      alt="Cover"
                      className="w-full h-40 object-cover transition-transform duration-300 transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-medium">
                        View Cover
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {props?.finalData?.movie?.urlImagenFondo && (
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Background Image
                  </h3>
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={props.finalData.movie.urlImagenFondo}
                      alt="Background"
                      className="w-full h-40 object-cover transition-transform duration-300 transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-medium">
                        View Background
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {props?.finalData?.movie?.urlImagenApoyo && (
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Support Image
                  </h3>
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={props.finalData.movie.urlImagenApoyo}
                      alt="Support"
                      className="w-full h-40 object-cover transition-transform duration-300 transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-medium">
                        View Support
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
