"use client";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Component() {
  const formik = useFormik({
    initialValues: {
      submission_id: "",
      email: "",
    },
    validationSchema: Yup.object({
      submission_id: Yup.string().required("Submission ID is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Your email is required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      // Aquí puedes manejar la lógica de inicio de sesión
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fondoLogin">
      <div className="max-w-md w-full space-y-8">
        <div className=" text-center">
          <img
            src="https://www.gironafilmfestival.com/wp-content/uploads/2022/08/logo-girona-film-festival.png"
            className=" w-32 mx-auto mb-3"
          />

          <h2 className="mt-3 text-center text-2xl font-bold text-red-500">
            Girona Film Festival
          </h2>
          <h2 className="mt-3 text-center text-lg font-light text-white">
            Download your certificate, movie streaming administration
          </h2>
          <h2 className="mt-3 text-center text-sm font-medium text-gray-300">
            Please provide your submission ID and email <br /> (registered in
            FilmFreeway)
          </h2>
          <h2 className="mt-4 text-center text-sm text-green-300">
            If is correct you will receive an email with a link to access the
            platform.
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="submission_id" className="sr-only">
                Submission ID
              </label>
              <input
                id="submission_id"
                name="submission_id"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Submission ID"
                {...formik.getFieldProps("submission_id")}
              />
              {formik.touched.submission_id && formik.errors.submission_id ? (
                <div className="text-red-500 text-xs mt-1 mb-3">
                  {formik.errors.submission_id}
                </div>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1 mb-3">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Send me the link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
