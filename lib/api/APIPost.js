import toast from "react-hot-toast";
import GironaFilmFestivalAxios from "../helpers/GironaFilmFestivalAxios";

export const axiosAPIPost = async (url = "", params = {}, values = {}) => {
  try {
    const response = await GironaFilmFestivalAxios.post(url, values, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-AllowHeaders": "*",
      },
      params: params,
    });

    if (response.status === 200) {
      console.log(response.data);
      return response;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Puedes lanzar el error nuevamente o manejarlo de otra manera
    return error;
  }
};
