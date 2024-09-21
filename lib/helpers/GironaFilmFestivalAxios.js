import axios from "axios";
import Cookies from "js-cookie";
let token = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME);
const GironaFilmFestivalAxios = axios.create();
GironaFilmFestivalAxios.defaults.headers.common["access-token"] = token;
GironaFilmFestivalAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
export default GironaFilmFestivalAxios;
